describe('Automated Accessibility Testing POC', ()=>{

    it('This page should be accessible.', ()=>{
        cy.testAccessibility('');
    })
})