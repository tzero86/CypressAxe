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
    critical: '🟥',
    serious:  '🟧',
    moderate: '🟨',
    minor:    '🟩'

}

// TODO: to clean things up a bit, we need to consolidate all results info into a new object and have that object feed the template.
let resultsSummary = {
    date: '',
    environment: '',
    url: '',
    results: {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
    },
}


// This function generates an HTML string representation of a table from the Violations objects returned as tests results from axe-core
function generateTable(json){
  // each violation found
  let cols = Object.keys(json[0]);
  
    //Map over columns, make headers,join into string
    let headerRow = cols
      .map(col => `<th>${col}</th>`)
      .join("");
    //map over array of json objs, for each row(obj) map over column values, return a td with the value of that object for its column
    //take that array of tds and join them, then return a row of the tds, finally joins all the rows together
    let rows = json
      .map(row => {
        let tds = cols.map(col => `<td>${row[col]}</td>`).join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");
  
    // we build the table with the header and rows we generated
    const table = `
      <table>
          <thead>
              <tr>${headerRow}</tr>
          <thead>
          <tbody>
              ${rows}
          <tbody>
      <table>`;
  
    return table;
}


// Manages the counting of issues by a given severity
// TODO: this needs some cleaning on the HTML report side, since we are adding an emoji to the severities(impact) the search is not optimal and too verbose
function getTotalIssues(violations, query){
    let count = 0;
    violations.forEach(violation => { 
        if(violation.IMPACT == query){
           count++;
      };
    })
   return count;
}


// Actually generates the HTML report to a file
function generateReport(violations){
    let table = generateTable(violations);
    let day = new Date();
    let templateFile = `
<!DOCTYPE html>
<html>
    <head>
        <title>ADA Test Results</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>

            @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700');

            html,
            body,
            div,
            span,
            applet,
            object,
            iframe,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            p,
            blockquote,
            pre,
            a,
            abbr,
            acronym,
            address,
            big,
            cite,
            code,
            del,
            dfn,
            em,
            img,
            ins,
            kbd,
            q,
            s,
            samp,
            small,
            strike,
            strong,
            sub,
            sup,
            tt,
            var,
            b,
            u,
            i,
            center,
            dl,
            dt,
            dd,
            ol,
            ul,
            li,
            fieldset,
            form,
            label,
            legend,
            table,
            caption,
            tbody,
            tfoot,
            thead,
            tr,
            th,
            td,
            article,
            aside,
            canvas,
            details,
            embed,
            figure,
            figcaption,
            footer,
            header,
            hgroup,
            menu,
            nav,
            output,
            ruby,
            section,
            summary,
            time,
            mark,
            audio,
            video {
                margin: 0;
                padding: 0;
                border: 0;
                font-size: 100%;
                font: inherit;
                vertical-align: baseline;
            }
            /* HTML5 display-role reset for older browsers */
            article,
            aside,
            details,
            figcaption,
            figure,
            footer,
            header,
            hgroup,
            menu,
            nav,
            section {
                display: block;
            }
            a {
                text-decoration: none;
                text-transform: none;
                color: #4A90E2;
            }

            body {
                line-height: 1;
                font-family: lato, ubuntu, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                font-size: 19px;
                background-color: #FEFEFE;
                color: #04143A;
            }
            ol,
            ul {
                list-style: none;
            }
            blockquote,
            q {
                quotes: none;
            }
            blockquote:before,
            blockquote:after,
            q:before,
            q:after {
                content: '';
                content: none;
            }
            table {
                border-collapse: collapse;
                border-spacing: 0;
            }

            p {
                color: #15171a;
                font-size: 17;
                line-height: 31px;
            }

            strong {
                font-weight: 600;
            }

            div,
            footer {
                box-sizing: border-box;
            }

            /* Reset ends */


            /*Hero section*/

            .container {
                max-width: 1100px;
                height: auto;
                margin: 60px auto;
            }

            .hero {
                margin: 50px auto;
                position: relative;
            }

            h1.name {
                font-size: 70px;
                font-weight: 300;
                display: inline-block;
            }

            .job-title {
                vertical-align: top;
                background-color: #D9E7F8;
                color: #4A90E2;
                font-weight: 600;
                margin-top: 5px;
                margin-left: 20px;
                border-radius: 5px;
                display: inline-block;
                padding: 15px 25px;
            }

            .email {
                display: block;
                font-size: 24px;
                font-weight: 300;
                color: #81899C;
                margin-top: 10px;
            }

            .lead {
                font-size: 44px;
                font-weight: 300;
                margin-top: 60px;
                line-height: 55px;
            }

            /*hero ends*/

            /*skills & intrests*/

            .sections {
                vertical-align: top;
                display: inline-block;
                width: 49.7%;
                height: 50px;
            }

            .section-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 15px;
            }

            .list-card {
                margin: 30px 0;
            }

            .list-card .exp,
            .list-card div {
                display: inline-block;
                vertical-align: top;
            }

            .list-card .exp {
                margin-right: 15px;
                color: #4A90E2;
                font-weight: 600;
                width: 100px;
            }

            .list-card div {
                width: 70%;
            }

            .list-card h3 {
                font-size: 20px;
                font-weight: 600;
                color: #5B6A9A;
                line-height: 26px;
                margin-bottom: 8px;
            }

            .list-card div span {
                font-size: 16px;
                color: #81899C;
                line-height: 22px;
            }

            /*skill and intrests ends*/

            /* Achievements */


            .cards {
                max-width: 1120px;
                display: block;
                margin-top: 280px;
            }

            .card {
                width: 47.9%;
                height: 200px;
                background-color: #EEF0F7;
                display: inline-block;
                margin: 7px 5px;
                vertical-align: top;
                border-radius: 10px;
                text-align: center;
                padding-top: 50px
            }

            .card-active,
            .card:hover {
                transform: scale(1.02);
                transition: 0.5s;
                background-color: #fff;
                box-shadow: 0 5px 50px -8px #ddd;
                cursor: pointer;
            }


            .skill-level {
                display: inline-block;
                max-width: 160px;
            }

            .skill-level span {
                font-size: 35px;
                font-weight: 300;
                color: #5B6A9A;
                vertical-align: top;
            }

            .skill-level h2 {
                font-size: 95px;
                font-weight: 300;
                display: inline-block;
                vertical-align: top;
                color: #5B6A9A;
                letter-spacing: -5px;
            }

            .skill-meta {
                vertical-align: top;
                display: inline-block;
                max-width: 300px;
                text-align: left;
                margin-top: 15px;
                margin-left: 15px;
            }

            .skill-meta h3 {
                font-size: 20px;
                font-weight: 800;
                color: #5B6A9A;
                margin-bottom: 5px;
            }

            .skill-meta span {
                color: #81899C;
                line-height: 20px;
                font-size: 16px;
            }

            /* Achievements ends */


            /* Timeline styles*/


            ol {
                position: relative;
                display: block;
                margin: 100px 0;
                height: 2px;
                background: #EEF0F7;

            }
            ol::before,
            ol::after {
                content: "";
                position: absolute;
                top: -10px;
                display: block;
                width: 0;
                height: 0;
                border-radius: 10px;
                border: 0 solid #31708F;
            }
            ol::before {
                left: -5px;
            }
            ol::after {
                right: -10px;
                border: 0 solid transparent;
                border-right: 0;
                border-left: 20px solid #31708F;
                border-radius: 3px;
            }

            /* ---- Timeline elements ---- */
            li {
                position: relative;
                display: inline-block;
                float: left;
                width: 25%;
                height: 50px;
            }
            li .line {
                position: absolute;
                top: -47px;
                left: 1%;
                font-size: 20px;
                font-weight: 600;
                color: #04143A;
            }
            li .point {
                content: "";
                top: -7px;
                left: 0;
                display: block;
                width: 8px;
                height: 8px;
                border: 4px solid #fff;
                border-radius: 10px;
                background: #4A90E2;
                position: absolute;
            }
            li .description {
                display: none;
                padding: 10px 0;
                margin-top: 20px;
                position: relative;
                font-weight: normal;
                z-index: 1;
                max-width: 95%;
                font-size: 18px;
                font-weight: 600;
                line-height: 25px;
                color: #5B6A9A;
            }
            .description::before {
                content: '';
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid #f4f4f4;
                position: absolute;
                top: -5px;
                left: 43%;
            }


            .timeline .date {
                font-size: 14px;
                color: #81899C;
                font-weight: 300;
            }

            /* ---- Hover effects ---- */
            li:hover {
                color: #48A4D2;
            }
            li .description {
                display: block;
            }

            /*timeline ends*/


            /* Media queries*/

            @media(max-width: 1024px) {
                .container {
                    padding: 15px;
                    margin: 0 auto;
                }
                .cards {
                    margin-top: 250px;
                }
            }

            @media(max-width: 768px) {
                .container {
                    padding: 15px;
                    margin: 0 auto;
                }
                .cards {
                    margin-top: 320px;
                }

                .card {
                    padding: 15px;
                    text-align: left;
                }
                .card h2 {
                    font-size: 70px;
                }
                .card,
                .sections {
                    width: 100%;
                    height: auto;
                    margin: 10px 0;
                    float: left;
                }

                .timeline {
                    border: none;
                    background-color: rgba(0, 0, 0, 0);
                }

                .timeline li {
                    margin-top: 70px;
                    height: 150px;
                }
            }


            @media(max-width: 425px) {
                h1.name {
                    font-size: 40px;
                }

                .card,
                .sections {
                    width: 100%;
                    height: auto;
                    margin: 10px 0;
                    float: left;
                }

                .timeline {
                    display: none;
                }

                .job-title {
                    position: absolute;
                    font-size: 15px;
                    top: -40px;
                    right: 20px;
                    padding: 10px
                }

                .lead {
                    margin-top: 15px;
                    font-size: 20px;
                    line-height: 28px;
                }
                .container {
                    margin: 0;
                    padding: 0 15px;
                }
                footer {
                    margin-top: 2050px;
                }
            }
            table {
                border: 1px solid #ccc;
                border-collapse: collapse;
                margin: 0;
                padding: 0;
                width: 100%;
                table-layout: fixed;
              }
              
              table caption {
                font-size: 1.5em;
                margin: .5em 0 .75em;
              }
              
              table tr {
                background-color: #f8f8f8;
                border: 1px solid #ddd;
                padding: .35em;
              }
              
              table th,
              table td {
                padding: .625em;
                text-align: center;
                word-wrap: break-word;
              }
              
              table th {
                font-size: .85em;
                letter-spacing: .1em;
                text-transform: uppercase;
              }
              
              @media screen and (max-width: 600px) {
                table {
                  border: 0;
                }
              
                table caption {
                  font-size: 1.3em;
                }
                
                table thead {
                  border: none;
                  clip: rect(0 0 0 0);
                  height: 1px;
                  margin: -1px;
                  overflow: hidden;
                  padding: 0;
                  position: absolute;
                  width: 1px;
                }
                
                table tr {
                  border-bottom: 3px solid #ddd;
                  display: block;
                  margin-bottom: .625em;
                }
                
                table td {
                  border-bottom: 1px solid #ddd;
                  display: block;
                  font-size: .8em;
                  text-align: right;
                }
                
                table td::before {
                  /*
                  * aria-label has no advantage, it won't be read inside a table
                  content: attr(aria-label);
                  */
                  content: attr(data-label);
                  float: left;
                  font-weight: bold;
                  text-transform: uppercase;
                }
                
                table td:last-child {
                  border-bottom: 0;
                }
              }

        </style>
    </head>
    <body>

        <div class="container">
            <div class="hero">
                <h1 class="name"> 
                    <strong>ADA POC</strong>
                    Test Results</h1>
                <span class="job-title">v0.0.1</span>
                <span class="email">Health Choice</span>
                <p><br>This testing POC provides a rapid accessibility assessment of a target URL to assist manual ADA testing. As per Axe-Core library, covers around 55% of the Accessibility assessments usually performed by manual ADA testing without any false positives.</p>
                <br>
                <p>The following Axe-Core accessibility rules and group of rules are being tested for:</p>
                <div class="email list-card">
                    <p>
                        &#x1F680; WCAG2A, WCAG2AA, WCAG21A, WCAG21AA, ACT, SECTION 508 and ACCESSIBILITY BEST PRACTICES.</p>
                </div>
                <h2 class="lead">Summary of Results:</h2>
            </div>
        </div>

        <div class="container">

            <div class="sections">
                <h2 class="section-title"></h2>

                <div class="list-card">
                    <span class="exp"></span>
                    <div>
                        <h3>Accessibility Issues found:</h3>
                        <span>${violations.length}</span>
                    </div>
                </div>

                <div class="list-card">
                    <span class="exp"></span>
                    <div>
                        <h3>Test Executed On:</h3>
                        <span>${day.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <div class="sections">
                <h2 class="section-title"></h2>

                <div class="list-card">
                    <div>
                        <h3>URL:</h3>
                        <span><a href="${Cypress.config().baseUrl}${Cypress.env('specificUrl')}">${Cypress.config().baseUrl}${Cypress.env('specificUrl')}</a></span>
                    </div>
                </div>

                <div class="list-card">
                    <div>
                        <h3>Environment:</h3>
                        <span>${Cypress.config().environment}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container cards">

            <div class="card">
                <div class="skill-level">
                    <span></span>
                    <h2>${getTotalIssues(violations, indicators['critical']+" "+"CRITICAL")}</h2>
                </div>

                <div class="skill-meta">
                    <h3>🟥 Critical</h3>
                    <span>Issues that really impact accessibility and should be looked into.</span>
                </div>
            </div>


            <div class="card">
                <div class="skill-level">
                    <h2>${getTotalIssues(violations, indicators['serious']+" "+"SERIOUS")}</h2>
                    <span></span>
                </div>

                <div class="skill-meta">
                    <h3>🟧 Serious</h3>
                    <span>Issues that significantly impact accessibility and should be looked into.</span>
                </div>
            </div>


            <div class="card">
                <div class="skill-level">
                    <h2>${getTotalIssues(violations, indicators['moderate']+" "+"MODERATE")}</h2>
                    <span></span>
                </div>

                <div class="skill-meta">
                    <h3>🟨 Moderate</h3>
                    <span>Issues that moderately impact accessibility.</span>
                </div>
            </div>


            <div class="card">
                <div class="skill-level">
                    <h2>${getTotalIssues(violations, indicators['minor']+" "+"MINOR")}</h2>
                    <span></span>
                </div>

                <div class="skill-meta">
                    <h3>🟩 Minor</h3>
                    <span>Minor impact issues that would be nice to fix if possible.</span>
                </div>
            </div>

        </div>


        <div class="container">
			<p>If you have any questions please don't hesitate to reach out to Health Choice US QC Team.</p>
		</div>

        <div class="container resultsTable">
			${table}
		</div>


        <br><br>


        <footer class="container">
            <span style="font-size: 16px; margin-top: ">2021 Health Choice US QC Team</span>
        </footer>
    </body>
</html>
`;
    //let filename = `./results/ADA_Results_${Date.now()}.html`;
    let filename = `./results/ADA_Results_test.html`;
    let file = {
        filename : filename,
        fileBody : templateFile
    }
    cy.task('generateReport', file);
}


// Manages the overall use of the log data to get the Accessibility violations
// These violations will feed the report in both HTML and terminal (including Cypress Runner)
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
                consoleProps: () => violation,
                $el: Cypress.$(target.join(',')),
                message: target
            })
        })
    });
}

const terminalLog = (violations) => {
    cy.task('log', `\n${'TEST RESULTS'}
      \n${violations.length
        } accessibility violation${violations.length === 1 ? '' : 's'
        } ${violations.length === 1 ? 'was' : 'were'
        } detected\n`)

    cy.log('log', violations)
    const violationData = violations.map(({
        id,
        impact,
        description,
        nodes,
        help,
        helpUrl
    }) => ({
        //TOTAL: nodes.length,
        IMPACT: `${indicators[impact]} ${impact.toUpperCase()}`,
        ISSUE_DETAILS: `<p><strong>RuleID: </strong>  ${id} (${help})<br><br>${nodes[0].failureSummary}</p><br><br><a href="${helpUrl}" target="_blank">More Info</a>`,
        ELEMENT_SELECTOR: `<p>${nodes.map(node => node.target).join('<br><br>')}</p>`
        //RESOURCES: `<a href="${helpUrl}">More Info</a>`,
        // TODO: these columns are the ones we need for the dynamic table, but some we don't need for the terminal. Need to split this data
    }))
    generateReport(violationData)
    //cy.task('table', violationData)
    
}


// This adds to Cypress a custom command that will handle in an all-in-one kind of way the injection, navigation and execution of the tests
// passing the results into the callback function logViolations(), which further handles the reporting.
Cypress.Commands.add('testAccessibility', (path) => {
    cy.visit(path)
    cy.injectAxe()
    cy.checkA11y(null, {
        runOnly: {
            type: 'tag',
            values: [
                'wcag2a',
                'wcag2aa',
                'wcag21a',
                'wcag21aa',
                'best-practice',
                'ACT',
                'section508'
            ]
        }
    }, logViolations);
})

// Handles the test login form authentication(which requires no password)
Cypress.Commands.add('HCTestLogin', (username) => {
     // we navigate cypress to the login page (this URL loads the test login form)
     cy.visit('/HBEWeb', {
        onBeforeLoad: (win) => {
            win["parent"] = win;
        }
    })
    // we type in the username, we don't need a password
    cy.get('#TestLogin_username').type(`${username}`)
    // we click on the login button
    cy.get('#TestLogin_doTestLogin').click()
})