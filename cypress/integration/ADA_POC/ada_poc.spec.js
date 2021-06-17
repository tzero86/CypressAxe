describe('Automated Accessibility Testing POC', ()=>{

    it('This page should not have any major accessibility issues.', ()=>{
        cy.testAccessibility('');
    })
    
})