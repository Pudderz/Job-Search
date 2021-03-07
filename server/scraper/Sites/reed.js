const {reedTimeValue} = require('../../time/index.js')
async function reed(results, key){

    const details = await results.$('div.details');
    let location = await details.$eval('div.metadata > ul:nth-child(2) > li', node=> node.textContent);
    let summary = await details.$eval('div.description > p', node=> node.textContent);
    const header = await details.$('header');
    let position = await header.$eval('h3', node=> node.textContent);
    
    let postedAt = await header.$eval('div.posted-by', node=> node.textContent);
    let company = await header.$eval('div.posted-by > a', node=> node.textContent);
    let moreInfo = await header.$eval('h3 > a', node=> node.getAttribute('href'));
    
    location = location.trim();
    position = position.trim();
    
    //Removes the words after 'by...' and the word 'posted ' from the postedAt string
    postedAt= postedAt.trim();
    postedAt = postedAt.substring(postedAt.indexOf(' '), postedAt.lastIndexOf(`by ${company}`));
    
   // const time = timeValue(postedAt.substring(postedAt.indexOf(' ')))
    const [time, postedTime]= reedTimeValue(postedAt.substring(postedAt.indexOf(' ')+1))
    
    return {
        'position': position,
        'postedAt': postedTime,
        'location': location,
        'company': company,
        'summary': summary,
        'link': moreInfo,
        'id': key,
        'site': 'reed',
        'time': time,
    }
}


module.exports = reed;