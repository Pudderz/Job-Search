const {timeValue} = require('../../time/index.js');

async function linkedIn(results, linkedInKey){
    const div = await results.$('div.job-result-card__contents');
    const position = await div.$eval('h3' , node=> node.textContent);
    const summary = await div.$eval('div > p', node=> node.textContent);
    const postedAt = await div.$eval('div > time', node=> node.textContent);
    const moreInfo = await results.$eval('a.result-card__full-card-link', node=> node.getAttribute('href'));

    const company = await div.$eval('h4', node=> node.textContent)
    const location = await div.$eval('div > span', node=> node.textContent )
    
    const time = timeValue(postedAt);

    return {
        'position': position,
        'postedAt': postedAt,
        'location': location,
        'company': company,
        'summary': summary,
        'link': moreInfo,
        'id': linkedInKey,
        'site': 'linkedIn',
        'time': time,
    };

}


module.exports = linkedIn;