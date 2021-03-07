const {timeValue} = require('../../time/index.js');

async function indeed(info, indeedKey){
   
    let [postedAt, company, location, summary, moreInfo, position] = await Promise.allSettled([
        info.$eval('.date', date => date.textContent),
        info.$eval('.company', date => date.textContent),
        info.$eval('.location', date => date.textContent),
        info.$eval('.summary', date => date.textContent),
        info.$$eval('h2>a', node => node.map((e) => e.getAttribute('href'))),
        info.$$eval('h2>a', node => node.map((e) => e.getAttribute('title'))),
    ])
    // let postedAt = await info.$eval('.date', date => date.textContent);
    let salary = await info.$('.salary');
    if(salary){
        salary = await salary.evaluate(node => node.textContent);
    }
    
    const time = timeValue(postedAt.value);
    return ({
        'position': position.value[0],
        'postedAt': postedAt.value,
        'location': location.value,
        'company': company.value,
        'salary': salary,
        'summary': summary.value,
        'link': moreInfo.value[0],
        'id': indeedKey,
        'site': 'indeed',
        'time': time,
    });

}


module.exports = indeed;