describe('Automated Accessibility Testing POC', ()=>{

    it('This page should not have any major accessibility issues.', ()=>{
        
        cy.testAccessibility(Cypress.env('specificUrl'));
        
    })

    //TODO: cover other scenarios or pages (single element, exclude elements, other pages of the app)

})