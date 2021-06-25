describe('User Logged in - Customer Dashboard ADA Testing.', () => {
    it('The user dashboard should not have accesibility issues.', () => {
        // we navigate cypress to the login page (this URL loads the test login form)
        cy.visit('/HBEWeb', {
            onBeforeLoad: (win) => {
                win["parent"] = win;
            }
        })
        // we type in the username, we don't need a password
        cy.get('#TestLogin_username').type('customer1')
        // we click on the login button
        cy.get('#TestLogin_doTestLogin').click()
        // finally we run the ADA test command and we send it the URL of the dashboard for example for it to test
        cy.testAccessibility('/HBEWeb/DisplayAccountHomeTab')
        
    });
});