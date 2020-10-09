const puppeteer = require('puppeteer');
const express = require('express');
//dotenv allows us to declare environment variables in a .env file
require("dotenv").config();
const path = require('path');
const port = process.env.PORT || 8080;
let browser;
const app = express()
const regex = /^\d+/i;
app.listen(port, async ()=>{
    console.log(`listening on : ${port}`)
    browser = await puppeteer.launch({
        headless: false,
        'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ]
    });
})


app.use(express.static('public'))

app.get('/stream', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    "Access-Control-Allow-Origin": "*",

  })
  console.log('Scraping started')
  sortScraping(res, req);
})

//Works out a rough value of time from the postedAt value e.g 3 weeks ago
//to 21 so that it is easier to quicksort them on the clients page. If it
//does not have a value it will most likely be 'Just Posted' or 'Today' so
// I set the value to 0
function timeValue(postedAt){
    let time=0;
    let TimeNum = (regex.test(postedAt))? postedAt.match(/^\d+/i) : 0;
    let unitOfTime = postedAt.match(/[a-z]+/i);
    switch(unitOfTime[0]){
        case 'days':
        case 'day' :  
            time = +TimeNum[0];
            break;
        case 'weeks':
        case 'week' :  
            time = +TimeNum[0]*7;
            break;
        case 'months':
        case 'month' :  
            time = +TimeNum[0]*31;
            break;
        case 'hour':
        case 'hours':  
            time = +TimeNum[0]/24;
            break;
        case 'Yesterday':
            time = 1;
            break;
        default:
            time=0;   
    }
    return time;
}


async function scraper(res, site, url, callback, smallSizeQuestion, showCSS, waitForSelector, findItems, startingKey){

    const page = await browser.newPage();
    let key=startingKey;
    let numOfErrors = 0;
    try{
        if(smallSizeQuestion){
             //I view the page in a phone viewport as only the phone view provides brief
        //snippets in linkedIn while the standard view does not
        const iPhone = puppeteer.devices['iPhone 6'];
        await page.emulate(iPhone);
        }else{
            await page.setViewport({
            width: 1500,
            height: 900,
            deviceScaleFactor: 1,
          });
        }
        if(!showCSS){
            //stops page loading css
            page.setRequestInterception(true);
            page.on('request', req=>{
                if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
                    req.abort();
                }else{
                    req.continue();
                }
            })
        }
        await page.goto(url);
        await page.waitForSelector(waitForSelector, {timeout: 2000});
        const jobSiteResults = await page.$$(findItems);
    
    for(results of jobSiteResults){
        try{
            const itemResult =await callback(results, key, page);
            res.write(`event: newData\ndata: ${JSON.stringify(itemResult)}\n\n`);
        }catch(e){
            numOfErrors++;
            console.log('error occured in jobSite search ' + e);
            console.log('JobSite couldnt scrape key:'+ key);
        }finally{
            key++;
        }      
    }
    }catch(e){
        console.log(`error occured in ${site} search and couldnt be processed  ${e}`);
        res.write(`event: error\ndata: ${site}\n\n`);
    }finally{
        res.write(`event: close\ndata: ${site}\n\n`);
        await page.close();
        console.log(`${site} Page finished and closed, ${key-numOfErrors}/${key}  scraped`);
    }
}

async function indeed(info, indeedKey){
    // let indeedKey=0;
    // await indeedPage.waitForSelector('div.jobsearch-SerpJobCard', {timeout: 1000});
    //     const data = await indeedPage.$$('div.jobsearch-SerpJobCard');
    //     for(info of data){
    //         try{
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
        //     }catch(e){
        //         console.log('error occured in indeed search ' + e);
        //         console.log('indeed couldnt scrape key: ' + indeedKey);
        //     } finally{
        //         indeedKey++;
        //     }
        // }
}
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
            postedAt = postedAt.trim();
            postedAt = postedAt.substring(postedAt.indexOf(' '), postedAt.lastIndexOf(`by ${company}`));

            const time = timeValue(postedAt.substring(postedAt.indexOf(' ')))
        
            return {
                'position': position,
                'postedAt': postedAt,
                'location': location,
                'company': company,
                'summary': summary,
                'link': moreInfo,
                'id': key,
                'site': 'reed',
                'time': time,
            }
}
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
            
            postedAt = postedAt.trim();
            location = location.trim();
            company = company.trim();
           
            location = location.substring(0,location.lastIndexOf(' from')-1)
            if(postedAt.includes('Posted '))postedAt = postedAt.substring(postedAt.indexOf(' ')+1);
            const time = timeValue(postedAt);

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

async function sortScraping(res, req){
    await checkIfBrowserIsRunning();
    scrapeJobs(res, req)
}
async function checkIfBrowserIsRunning(){
    //Creates a new page
    if(!browser)browser = await puppeteer.launch({headless: false,
        'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
        ]})
}
function  scrapeJobs(res, req) {
    
    const searchQuery = req.query.q; 
    const location = req.query.location;
    const sortBy = req.query.sortBy;


    if(req.query.indeed === 'true'){ 
        const url = new URL('https://www.indeed.co.uk/jobs');
        if(sortBy =='DD')url.searchParams.set('sort', 'date');
        if(req.query.inJob !== 'none')url.searchParams.set('jt', req.query.inJob)
        if(req.query.inDate !== 'none')url.searchParams.set('fromage', req.query.inDate)
        if(req.query.inRad !== 'none')url.searchParams.set('radius', req.query.inRad)
        if(req.query.inSal !== 'none'){
            url.searchParams.set('q', `${searchQuery}+${req.query.inSal}`)
        }else url.searchParams.set('q', `${searchQuery}`)
        scraper(res,'indeed', url, indeed, false, false, 'div.jobsearch-SerpJobCard','div.jobsearch-SerpJobCard', 0 );
    }

    if(req.query.linked === 'true'){
        const url = new URL(`https://www.linkedin.com/jobs/search`);
        url.searchParams.set('keywords', searchQuery);
        url.searchParams.set('location', location);
        if(sortBy =='DD')url.searchParams.set('sortBy', 'DD');
        if(req.query.lJob !== 'none')url.searchParams.set('f_JT', req.query.lJob);
        if(req.query.lDate !== 'none')url.searchParams.set('f_TP', req.query.lDate);
        scraper(res,'linkedIn', url, linkedIn, true, false, '.job-result-card', 'ul.jobs-search__results-list > li', 19);
    }
    if(req.query.jobsite === 'true'){
        const jobType = (req.query.jJob !== 'none')? `${req.query.jJob}/` : '';
        const url = new URL(`https://www.jobsite.co.uk/jobs/${jobType}${searchQuery}/in-${location}`);
        if(sortBy =='DD')url.searchParams.set('Sort', '2');
        if(sortBy =='DD')url.searchParams.set('scrolled', '268');
        if(req.query.jDate !== 'none')url.searchParams.set('postedwithin', req.query.jDate);
        if(req.query.jRad !== 'none')url.searchParams.set('radius', req.query.jRad);
        if(req.query.jSal !== 'none'){
            url.searchParams.set('salary', req.query.jRad);
            url.searchParams.set('salarytypeid', '1');
        }
        //const jobSiteUrl = `https://www.jobsite.co.uk/jobs/${jobType}${searchQuery}/in-${location}?${sort}${datePosted}${salary}${radius}`;
        scraper(res, 'jobSite', url, jobsite, true, true,'div.job','div.job.twinpeaks', 44 )
    }
    
    if(req.query.reed === 'true'){
        let sort=(sortBy =='DD')?'&sortby=DisplayDate' :'';
        const url = new URL(`https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}`);
        if(req.query.rJob !== 'none')url.searchParams.set(req.query.rJob, 'true');
        if(req.query.rRad !== 'none')url.searchParams.set('proximity', req.query.rRad);
        if(req.query.rSal !== 'none')url.searchParams.set('salaryfrom', req.query.rSal);
        if(req.query.rDate !== 'none')url.searchParams.set('datecreatedoffset',req.query.rDate);

        if(sortBy =='DD')url.searchParams.set('sort');
        //const reedUrl = `https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}?${salary}${radius}${jobType}${datePosted}${sort}`;
        scraper(res, 'reed', url, reed, true, false, 'article.job-result', 'article.job-result', 65)
        //scrapeReed(res, reedUrl)
    }
}

app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      });
