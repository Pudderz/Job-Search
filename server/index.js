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
  scrapeJobs(res, req)
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

async function scrapeIndeed(res, url){
    let indeedKey = 0;
    let indeedArray=[];
    let indeedArrayLength = 0;
    //Creates a new page
    if(!browser)browser = await puppeteer.launch({headless: false,
        'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
        ]})
    const indeedPage = await browser.newPage();
    try{
        await indeedPage.setViewport({
            width: 1500,
            height: 900,
            deviceScaleFactor: 1,
          });
        //stops page loading css
        indeedPage.setRequestInterception(true);
        indeedPage.on('request', req=>{
            if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
                req.abort();
            }else{
                req.continue();
            }
        })
        
        await indeedPage.goto(url);
        await indeedPage.waitForSelector('div.jobsearch-SerpJobCard', {timeout: 1000});
        const data = await indeedPage.$$('div.jobsearch-SerpJobCard');
        for(info of data){
            try{
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
                indeedArrayLength = indeedArray.push({
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
                res.write(`event: newData\ndata: ${JSON.stringify(indeedArray[indeedArrayLength-1])} \n\n`);     
            }catch(e){
                console.log('error occured in indeed search ' + e);
                console.log('indeed couldnt scrape key: ' + indeedKey);
            } finally{
                indeedKey++;
            }
        }
    }catch(e){
        console.log('error occured in indeed search and couldnt be processed ' + e);
        res.write(`event: error\ndata: indeed\n\n`);
    }finally{
        res.write(`event: close\ndata: indeed\n\n`);
        await indeedPage.close();
        console.log(`Indeed Page finished and closed, ${indeedArrayLength}/${indeedKey} scraped`); 
    }
}

async function scrapeLinked(res, linkedInUrl){
    if(!browser)browser = await puppeteer.launch({
            headless: false,
            'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]})
        const linkedInPage = await browser.newPage();

        //I set the key to 15 so the keys do not overlap with the indeedPages 
        let linkedInKey = 19;
        let linkedInArray = [];
        let linkedInArrayLength =0;
    try{
        linkedInPage.setRequestInterception(true);
        linkedInPage.on('request', req=>{
            if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
                req.abort();
            }else{
                req.continue();
            }
        })

        //I view the page in a phone viewport as only the phone view provides brief
        //snippets while the normal view does not
        const iPhone = puppeteer.devices['iPhone 6'];
        await linkedInPage.emulate(iPhone);
        
        
        await linkedInPage.goto(linkedInUrl, { waitUntil: 'domcontentloaded' });
        await linkedInPage.waitForSelector('.job-result-card', {timeout: 2000});
        const linkedInResults = await linkedInPage.$$('ul.jobs-search__results-list > li');
        
        
        for(results of linkedInResults){
            try{
                const div = await results.$('div.job-result-card__contents');
                const position = await div.$eval('h3' , node=> node.textContent);
                const summary = await div.$eval('div > p', node=> node.textContent);
                const postedAt = await div.$eval('div > time', node=> node.textContent);
                const moreInfo = await results.$eval('a.result-card__full-card-link', node=> node.getAttribute('href'));
            
                const company = await div.$eval('h4', node=> node.textContent)
                const location = await div.$eval('div > span', node=> node.textContent )
                
                const time = timeValue(postedAt);

                linkedInArrayLength = linkedInArray.push({
                    'position': position,
                    'postedAt': postedAt,
                    'location': location,
                    'company': company,
                    'summary': summary,
                    'link': moreInfo,
                    'id': linkedInKey,
                    'site': 'linkedIn',
                    'time': time,
                });
        
                res.write(`event: newData\ndata: ${JSON.stringify(linkedInArray[linkedInArrayLength-1])} \n\n`);
            }catch(e){
                console.log('error occured in LinkedIn search ' + e);
                console.log('LinkedIn couldnt scrape key'+ linkedInKey);
            }  finally{
               linkedInKey++; 
            }    
            
        }
        }catch(e){
            console.log('error occured in LinkedIn search ' + e);
            res.write(`event: error\ndata: linkedIn\n\n`);
        } finally{
            res.write(`event: close\ndata: linkedIn\n\n`);
            await linkedInPage.close();
            console.log(`LinkedIn Page finished and closed, ${linkedInArrayLength}/${linkedInKey-19} scraped`);
        }
}

async function scrapeReed(res, reedUrl){
    let reedArray = []
    //I set the key to 65 so the keys do not overlap with the other pages
    let reedKey = 65;
    let reedArrayLength =0;
        if(!browser)browser = await puppeteer.launch({
            headless: false,
            'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]})
        const reedPage = await browser.newPage();
    try{
        reedPage.setRequestInterception(true);
        reedPage.on('request', req=>{
            if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
                req.abort();
            }else{
                req.continue();
            }
        })

        //I view the page in a phone viewport as only the phone view provides brief
        //snippets while the normal view does not
        const iPhone = puppeteer.devices['iPhone 6'];
        await reedPage.emulate(iPhone);
        
        
        await reedPage.goto(reedUrl, { waitUntil: 'domcontentloaded' });
        await reedPage.waitForSelector('article.job-result', {timeout: 2000});
        const reedResults = await reedPage.$$('article.job-result');
        // await reedPage.waitForSelector('div.base-search-card__info', {timeout: 2000});
        
        for(results of reedResults){
            try{
            // let company,location,position,summary,postedAt,moreInfo  =
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
        
            reedArrayLength = reedArray.push({
                'position': position,
                'postedAt': postedAt,
                'location': location,
                'company': company,
                'summary': summary,
                'link': moreInfo,
                'id': reedKey,
                'site': 'reed',
                'time': time,
            });
            //console.log('reed', reedArray[arrayLength-1])
            res.write(`event: newData\ndata: ${JSON.stringify(reedArray[reedArrayLength-1])} \n\n`)
            }catch(e){
                console.log('error occured in reed search ' + e);
                console.log('Reed couldnt scrape key: '+ reedKey)
            }finally{
                reedKey++; 
            }    
        }
        }catch(e){
            console.log('error occured in reed search ' + e);
            res.write(`event: error\ndata: reed\n\n`);
        } finally{
            res.write(`event: close\ndata: reed\n\n`)
               await reedPage.close();
                console.log(`Reed scrape finished and closed, ${reedArrayLength}/${reedKey-64} scraped`);
        }
}

async function scrapeJobsite(res, jobSiteUrl){
    let jobSiteArray = []
    let jobSiteArrayLength =0;
    //I set the key to 44 so the keys do not overlap with the other pages
        let jobsiteKey = 44;
        if(!browser)browser = await puppeteer.launch({
            headless: false,
            'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]})
        const jobSitePage = await browser.newPage();
    try{
        const iPhone = puppeteer.devices['iPhone 6'];
        await jobSitePage.emulate(iPhone);

        
        
        await jobSitePage.goto(jobSiteUrl, { waitUntil: 'domcontentloaded' });
        await jobSitePage.waitForSelector('div.job', {timeout: 2000});
        const jobSiteResults = await jobSitePage.$$('div.job.twinpeaks');
        
        for(results of jobSiteResults){
            try{
                const divs = await results.$('div > div');
                const jobTitle = await divs.$('div > div > div.job-title > a');
                const detailsDiv = await divs.$(' div.detail-body');
                let company = await detailsDiv.$eval('div.row > div > ul.detail-list > li.company', node=> node.textContent);
                let location = await detailsDiv.$eval('#headerListContainer > ul > li.location', node=> node.textContent);
                let summary= await detailsDiv.$eval('div.row.detail-footer > div > div > p.job-intro', node=> node.textContent);
                let postedAt = await detailsDiv.$eval('div:nth-child(1) > div > ul > li.date-posted', node=> node.textContent);
                
                let position = await jobTitle.$eval('h2', node=> node.textContent);
                let moreInfo = await jobSitePage.evaluate(node=> node.getAttribute('href'), jobTitle);
                
                postedAt = postedAt.trim();
                location = location.trim();
                company = company.trim();
               
                location = location.substring(0,location.lastIndexOf(' from')-1)
                if(postedAt.includes('Posted '))postedAt = postedAt.substring(postedAt.indexOf(' ')+1);
                const time = timeValue(postedAt);
                jobSiteArrayLength = jobSiteArray.push({
                    'position': position,
                    'postedAt': postedAt,
                    'location': location,
                    'company': company,
                    'summary': summary,
                    'link': moreInfo,
                    'id': jobsiteKey,
                    'site': 'jobSite',
                    'time': time,
                });

                res.write(`event: newData\ndata: ${JSON.stringify(jobSiteArray[jobSiteArrayLength-1])} \n\n`);     
            }catch(e){
                console.log('error occured in jobSite search ' + e);
                console.log('JobSite couldnt scrape key:'+ jobsiteKey);
            }finally{
                jobsiteKey++;
            }      
        }
    }catch(e){
            console.log('error occured in Jobsite search ' + e);
            res.write(`event: error\ndata: jobSite\n\n`);
    }finally{
            await jobSitePage.close();
            res.write(`event: close\ndata: jobSite\n\n`);
            console.log(`JobSite Page finished and closed, ${jobSiteArrayLength}/${jobsiteKey-44} scraped`);
        }
}

function scrapeJobs(res, req) {
    
    const searchQuery = req.query.q; 
    const location = req.query.location;
    const sortBy = req.query.sortBy;
    const returnIndeed = req.query.indeed;
    const returnLinked = req.query.linked;
    const returnReed = req.query.reed;
    const returnJobsite = req.query.jobsite;

    if(returnIndeed === 'true'){ 
        const sort= (sortBy =='DD')? '&sort=date' : '';
        const jobType=(req.query.inJob !== 'none')? `&jt=${req.query.inJob}`: '';
        const datePosted=(req.query.inDate !== 'none')? `&fromage=${req.query.inDate}`: '';
        const radius=(req.query.inRad !== 'none')? `&radius=${req.query.inRad}`: '';
        const salary=(req.query.inSal !== 'none')? `+£${req.query.inSal}`: '';
        const url = `https://www.indeed.co.uk/jobs?q=${searchQuery}${salary}&l=${location}${sort}${datePosted}${radius}${jobType}`;
        console.log(url);
        scrapeIndeed(res, url);
    }
    if(returnLinked === 'true'){
        let sort=(sortBy =='DD')? '&sortBy=DD':'';
        const jobType=(req.query.lJob !== 'none')? `&f_JT=${req.query.lJob}`: '';
        const datePosted=(req.query.lDate !== 'none')? `&f_TP=${req.query.lDate}`: '';
        const linkedInUrl = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${location}${sort}${jobType}${datePosted}`;
        scrapeLinked(res, linkedInUrl);
    }
    if(returnJobsite === 'true'){
        let sort = (sortBy =='DD')?'?Sort=2&scrolled=268': '';
        const jobType = (req.query.jJob !== 'none')? `${req.query.jJob}/` : '';
        const datePosted = (req.query.jDate !== 'none')? `&postedwithin=${req.query.jDate}` : '';
        const radius = (req.query.jRad !== 'none')? `&radius=${req.query.jRad}` : '';
        const salary = (req.query.jSal !== 'none')? `&salary=${req.query.jSal}&salarytypeid=1` : '';
        const jobSiteUrl = `https://www.jobsite.co.uk/jobs/${jobType}${searchQuery}/in-${location}?${sort}${datePosted}${salary}${radius}`;
        scrapeJobsite(res, jobSiteUrl);
    }
    
    if(returnReed === 'true'){
        let sort=(sortBy =='DD')?'&sortby=DisplayDate' :'';
        const jobType=(req.query.rJob !== 'none')? `&${req.query.rJob}=true`: '';
        const datePosted=(req.query.rDate !== 'none')? `&datecreatedoffset=${req.query.rDate}`: '';
        const radius=(req.query.rRad !== 'none')? `&proximity=${req.query.rRad}`: '';
        const salary=(req.query.rSal !== 'none')? `salaryfrom=${req.query.rSal}`: '';
        const reedUrl = `https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}?${salary}${radius}${jobType}${datePosted}${sort}`;
        scrapeReed(res, reedUrl)
    }
}

app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      });
