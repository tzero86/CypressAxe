# Automated ADA Testing - (Axe-core & Cypress) - WORK IN PROGRESS

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

In order to get better results out of the automated testing we configured using Cypress and Axe-core, we need to do some tweaking.  We need to add some code in order for Cypress to be able to log the results from Axe in a more user-friendly-shareable format.  Open the following file: `cypress/plugins/index.js` the same we edited before. And add the following piece of code:

```js
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




















