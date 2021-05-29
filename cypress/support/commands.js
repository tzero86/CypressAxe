// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

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
            name: `[${indicators[violation.impact]} ${violation.impact}]`,
            consoleProps: () => violation,
            $el: nodes,
            message: `[${violation.help}](${violation.helpUrl})`

        }
        Cypress.log(log)

        violation.nodes.forEach(({ target }) => {
            Cypress.log({
                name: '- 🩸 FIXME',
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
      `${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected`
    )
    // pluck specific keys to keep the table readable
    cy.log('log', violations)
    const violationData = violations.map(
      ({ id, impact, description, nodes}) => ({
        name: `${indicators[impact]} ${impact}`,
        nodes: nodes.length,
        id,
        description,
        //html: nodes[0].html,
        //summary: nodes[0].failureSummary
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

