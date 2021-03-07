const {timeValue} = require('../../time/index.js');
async function jobsite(results, key, page){
    
    const divs = await results.$('div > div');
    const jobTitle = await divs.$('div > div > div.job-title > a');
    const detailsDiv = await divs.$(' div.detail-body');
    let company = await detailsDiv.$eval('div.row > div > ul.detail-list > li.company', node=> node.textContent);
    let location = await detailsDiv.$eval('#headerListContainer > ul > li.location', node=> node.textContent);
    let summary= await detailsDiv.$eval('div.row.detail-footer > div > div > p.job-intro', node=> node.textContent);
    let postedAt = await detailsDiv.$eval('div:nth-child(1) > div > ul > li.date-posted', node=> node.textContent);
    
    let position = await jobTitle.$eval('h2', node=> node.textContent);
    
    let moreInfo = await page.evaluate(node=> node.getAttribute('href'), jobTitle);
    
    
    
    company = company.trim();
    location = location.trim();
    location = location.substring(0,location.lastIndexOf(' from')-1);
    
    postedAt = postedAt.trim();
    if(postedAt.includes('Posted '))postedAt = postedAt.substring(postedAt.indexOf(' ')+1);

    
    //Removes the Expires in from the postedAt for the timeValue function so it can be given
    //an appropiate time value
    const time = (postedAt.includes('Expires in '))?
        timeValue(postedAt.substring(postedAt.lastIndexOf('Expires in ')+11)):
        timeValue(postedAt);
    
    return {
        'position': position,
        'postedAt': postedAt,
        'location': location,
        'company': company,
        'summary': summary,
        'link': moreInfo,
        'id': key,
        'site': 'jobSite',
        'time': time,
    }     

}


module.exports = jobsite;