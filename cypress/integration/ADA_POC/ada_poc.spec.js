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
      ({ id, impact, description, nodes, html }) => ({
        nodes: nodes.length,
        id,
        impact,
        description,
        html: nodes[0].html,
        //summary: nodes[0].failureSummary
      })
    )
   
    cy.task('table', violationData)
  }


describe('Accessibility testing POC', ()=>{
    it('This page should be accessible.', ()=>{
        cy.visit('/');
        cy.injectAxe();
        cy.checkA11y(
            '',
            {
              runOnly: {
                type: 'tag',
                values: ['wcag2a'],
              },
            },
            terminalLog,
          );
        
    })
})