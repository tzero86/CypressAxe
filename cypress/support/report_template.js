const templateFile = '../report/report_template.html'

function getBaseTemplate(){
    let template ;
    fetch(templateFile).then( resp => {
        template = resp.text()
    } )
    return template;
}

export { getBaseTemplate }