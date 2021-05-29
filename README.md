# Automated ADA Testing - (Axe-core & Cypress) - WORK IN PROGRESS

The other day at work a colleague shared the basics on how to start doing Accessibility testing using JAWS and WAVE. It was quite motivating so I started looking into how we can have some of these tests automated and found out that there is actually a way to run automated accessibility tests that could provide a good amount of coverage in a really fast manner. I

This could potentially benefit the rest of the team to allow them to have an extra tool that could quickly provide an accessibility assessment, at least for all possible tests covered by the Axe-Core Library.

Anyways, I took some time today to draft this quick POC on how to run some accessibility tests with Cypress and Axe-Core. I did have to spend some time on getting some better-formatted results so this is actually something useful.


## ⚠️ Requirements

To get started we'll need the following installed on the machine where you plan to run this POC:

- JavaScript IDE: Visual Studio Code, Atom, etc.
- NodeJS LTS Version Installed
- Cypress latest version.
- Chrome or any other browser supported by Cypress.


## Setting up the tools

Let's start by setting up **NodeJS**. Depending on your OS you'll grab the corresponding installer from [here](https://nodejs.org/en/).  In my case I'm running Manjaro Linux, so I had to run this: `sudo pacman -S nodejs` and `sudo pacman -S npm`. But it any case the installation is well documented on NodeJS' website so we won't spend any more time on this.

Now we need to start a new project,  for that you'll run the following command in a folder of your choosing: `npm init -y` to initialize the project. In my case I ran these commands already from VSCode integrated terminal.

![](https://i.imgur.com/w8UvxXw.png)

Next is setting up **[Cypress](https://www.cypress.io/)**, and that just requires running the following in the terminal: `npm install cypress`

![](https://i.imgur.com/a3yCZWj.png)

Once that is done, we run the following to start Cypress: `npx cypress open`.
![](https://i.imgur.com/ZkV36fc.png)

With this we have Cypress ready and we can just close it out for now. Next we need to install Axe-Core plugin for Cypress. In the same terminal we run the following command: `npm install cypress-axe` and then `npm install axe-core`

After that our **package.json** file should look something like this:
![](https://i.imgur.com/pS949B3.png)

We are almost ready to start creating our automated accessibility testing POC, we just need one last detail. We need to update Cypress' support files so it loads the cypress-axe commands for us to use and also so Cypress can log the results of the testing done by Axe. We need to import **Cypress-axe** into `cypress/support/index.js` file in the import commands section, you just need to add `import 'cypress-axe'` .  This will cause that all Cypress-axe commands get accessible from the `cy` object exposed by Cypress.

![](https://i.imgur.com/sVxgIrf.png)

That's it, now let's move to the actual testing with these tools we just set.

## Cypress & Axe POC

To get things started we need to create a new file: `ada_poc.spec.js`, inside this file we'll add our sample test and configure the rest so we can have a working prototype of how we can integrate accessibility testing into an E2E automation solution. Even if we don't want to create a whole E2E automation suite, we can still have a very fast test that will run on whatever page we need it to scan and will return a list of all the accessibility issues detected.

> **NOTE:** It is important to understand that this testing POC WONT cover all possible accessibility issues and WONT replace manual ADA testing. As per Axe's library, it should cover around 55% of the Accessibility assessments without any false positives.


Let's add one generic sample test to our recently created file:

```js
// FILE: cypress/integration/ADA_POC/ada_poc.spec.js

describe('Accessibility testing POC', ()=>{
	it('This page should be accessible.', ()=>{
		cy.visit('www.google.com');
		cy.injectAxe();
		cy.checkA11y();
	})
})
```

And if we run `npx cypress open` and click on our test we see the following:

![](https://i.imgur.com/5FYOOlY.png)

It seems to be working, it found 5 issues! It is important to mention that Cypress-axe will run, by default, on the entire URL we pass to Cypress. But it can be configured to scan or even exclude desired elements on the page.

However, the results are not that useful right now. We know that Axe seems to have detected some accessibility issues on the target page, but we definitely need better results so we can assess the impact of the issues, determine if we need to assign those to QA for further testing with JAWS/WAVE to confirm the impact, have those reported as bugs and also to be able to provide some details to the DEV team to review the problem more easily.

## Getting better test results

In order to get better results out of the automated testing we configured using Cypress and Axe-core, we need to do some tweaking.  We need to add some code in order for Cypress to be able to log the results from Axe in a more user-friendly-shareable format.  Open the following file: `cypress/plugins/index.js`, notice this is not the same file we edited before. Once opened we'll be adding the following piece of code. This code will create a custom command and two helper functions that will pretty-format the test results so the results can be easily reviewed in both console and the Cypress runner. 

The custom command connects all the parts and will let us even further simplify our tests, since we can focus just on the logic required for the test itself leaving all helper functions under cypress configuration files. Then by calling this single command called `testAccessibility`, the code will automatically take care of instructing Cypress to navigate to the target page, will inject Axe into the page and then run the Axe-Core tests for [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) A and AA tests automatically.

```js
// FILE: cypress/plugins/index.js

module.exports = (on, config) => {
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
    table(message) {
      console.table(message)
      return null
    }
  })
}
```

Now we need to add some more code into the following file: `cypress/support/commands.js`, this is how the file should look like:

```js

const indicators = {
    minor: '🟡',
    moderate: '🟠',
    serious: '🔴',
    critical: '⛔',
}

function logViolations(violations) {
    terminalLog(violations)
    violations.forEach(violation => {
        const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','))
        let log = {
            name: `[${indicators[violation.impact]} ${violation.impact.toUpperCase()}]`,
            consoleProps: () => violation,
            $el: nodes,
            message: `[${violation.help}](${violation.helpUrl})`

        }
        Cypress.log(log)

        violation.nodes.forEach(({ target }) => {
            Cypress.log({
                name: '-🩸FIXME',
                consoleProps: ()=> violation,
                $el: Cypress.$(target.join(',')),
                message: target
            })

        })
    });
}

const terminalLog = (violations) => {
    cy.task(
      'log',
      `\n${'TEST RESULTS'}
      \n${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected\n`
    )
    
    cy.log('log', violations)
    const violationData = violations.map(
      ({ id, impact, description, nodes, help, helpUrl}) => ({
        QUANTITY: nodes.length,
        IMPACT: `${indicators[impact]} ${impact.toUpperCase()}`,
        ID:id,
        DESCRIPTION: help,
      })
    )

    cy.task('table', violationData)
  }


Cypress.Commands.add('testAccessibility', (path) => {
    cy.visit(path)
    cy.injectAxe()
    cy.checkA11y(
        null,
        {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa'],
          },
        },
        logViolations,
      );
})

```

This will let us have better results outputting to the console as well as in the Cypress runner. It will clearly highlight and color code issues by impact severity and in the case of the runner, it will also detail all elements affected by each accessibility issue. This is not added to the console since the output gets messed up if you have long texts or too much data. We'll cover later on how we can generate a full report from these results that we can further analyze or even share.

With all this done let's take a look at how our test will look like:

```js
// FILE: cypress/integration/ADA_POC/ada_poc.spec.js

describe('Automated Accessibility Testing POC', ()=>{

    it('This page should be accessible.', ()=>{
        cy.testAccessibility('');
    })
})
```

As you can see it is now much more readable and simple, and this simple custom command can now be used along any E2E regular automated tests and have the accessibility tested along them. It is worth mentioning that this POC is just using all Axe-core tests on base URL but it can very well be targeted to specific scenarios or even to test after an automated user interaction is performed to see how the accessibility features of the website are behaving in those cases.

But we did a lot of work to get better results and we haven't seen any so far, lets check how the results show up in the console first:

![](https://i.imgur.com/5tUTG7j.png)


They are looking quite nice and readable to me, at least compared to the previous output we had. Now let's see the same in the Cypress Runner:

![](https://i.imgur.com/Z0v1n9E.png)

Notice that now the issues are clearly listed in the runner details, with colored output and it even lists all the elements that are affected for each type of issue found(those FIXME that you can see in the image). You can even click on the FIXME items and the corresponding html element will be highlighted in the Cypress' runner integrated browser.


## Planned additions

📌 Generate a JSON Full Report

📌 Generate an HTML formatted report for sharing

📌 Add example tests of specific elements testing

📌 Add details on which types of tests and rules can be tested with the Axe-Core integration.


That's all for now, let' me think if there is anything else we might need to detail here and I might be back later with more updates for you my README.md friend.



@tzero86



















