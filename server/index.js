const puppeteer = require('puppeteer');
const express = require('express');
//dotenv allows us to declare environment variables in a .env file
require("dotenv").config();
const path = require('path');
const port = process.env.PORT || 8080;
let browser;
const app = express()
const regex = /^\d+/i;
app.listen(port, ()=>{
    console.log(`listening on : ${port}`)
    
})


let createBrowser = (async ()=>{browser = await puppeteer.launch({
    headless: false,
    'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox',
]})})();

app.use(express.static('public'))

app.get('/stream', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    "Access-Control-Allow-Origin": "*",

  })
  console.log('running')
  scrapeJobs(res, req)
})

//Works out a rough value of time from the postedAt value e.g 3 weeks ago
//to 21 so that it is easier to quicksort them on the clients page. If it
//does not have a value it will most likely be 'Just Posted' or 'Today' so
// I set the value to 0
function timeValue(postedAt){
    let time=0;
    if(regex.test(postedAt)){
        let TimeNum = postedAt.match(/^\d+/i);
        let unitOfTime = postedAt.match(/[a-z]+/i);
        unitOfTime = unitOfTime[0].toLowercase;
        switch(unitOfTime){
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
            case 'yesterday':
                time = 1;
                break;
            default:
                time=0;   
        }
    }
    return time;
}

async function scrapeIndeed(res, url){
    try{
        let indeedKey = 0;
        let indeedArray=[];
        //Creates a new page
        if(!browser)browser = await puppeteer.launch({headless: false,
            'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]})
        const indeedPage = await browser.newPage();
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
                    salary = await salary.evaluate(node => node.textContent)
                }
                
                const time = timeValue(postedAt.value);
                
                let arrayLength = indeedArray.push({
                    'position': position.value,
                    'postedAt': postedAt.value,
                    'location': location.value,
                    'company': company.value,
                    'salary': salary,
                    'summary': summary.value,
                    'link': moreInfo.value,
                    'id': indeedKey,
                    'site': 'indeed',
                    'time': time,
                });
                console.log(`scraping indeed ${indeedKey}`)
                res.write(`event: newData\ndata: ${JSON.stringify(indeedArray[arrayLength-1])} \n\n`)     
            }catch(e){
                console.log('error occured in indeed search ' + e);
                console.log('indeed couldnt be processed with key: ' + indeedKey);
            } finally{
                indeedKey++;
                if(indeedKey== data.length){
                    res.write(`event: close\ndata: indeed\n\n`)
                    indeedPage.close()   
                }
            }
            
            
        }
    }catch(e){
        console.log('error occured in indeed search and couldnt be processed ' + e);
        res.write(`event: error\ndata: indeed\n\n`);
        res.write(`event: close\ndata: indeed\n\n`);
        indeedPage.close()   
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


    try{
        let linkedInArray = [];
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
        //I set the key to 15 so the keys do not overlap with the indeedPages 
        let linkedInKey = 19;
        
        await linkedInPage.goto(linkedInUrl, { waitUntil: 'domcontentloaded' });
        await linkedInPage.waitForSelector('.job-search-card', {timeout: 2000});
        const linkedInResults = await linkedInPage.$$('ul.jobs-search__results-list > li');
        await linkedInPage.waitForSelector('.job-search-card', {timeout: 2000});
        
        for(results of linkedInResults){
            try{
                const div = await results.$('div > div.base-search-card__info');
                const position = await div.$eval('h3' , node=> node.textContent);
                const summary = await div.$eval('div > p', node=> node.textContent);
                const postedAt = await div.$eval('div > time', node=> node.textContent);
                const moreInfo = await results.$eval('div > a', node=> node.getAttribute('href'));
            
                const company = await div.$eval('h4 > :first-child', node=> node.textContent)
                const location = await div.$eval('h4 > :nth-child(2)', node=> node.textContent )
                
            
                console.log(company)
                const time = timeValue(postedAt);
        
                const arrayLength = linkedInArray.push({
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
        
                console.log(`scraping LinkedIn ${linkedInKey}`);
                res.write(`event: newData\ndata: ${JSON.stringify(linkedInArray[arrayLength-1])} \n\n`);
            }catch(e){
                console.log('error occured in LinkedIn search ' + e);
                console.log('couldnt find '+ linkedInKey);
            }  finally{
               linkedInKey++; 
            }    
            
        }
            console.log('end')
        }catch(e){
            console.log('error occured in LinkedIn search ' + e);
            res.write(`event: error\ndata: linkedIn\n\n`);
            res.write(`event: close\ndata: linkedIn\n\n`);
            // linkedInPage.close();
        } finally{
            res.write(`event: close\ndata: linkedIn\n\n`);
                //linkedInPage.close();
                console.log('closed');
        }
}

async function scrapeReed(res, reedUrl){
    try{
        let reedArray = []
        if(!browser)browser = await puppeteer.launch({
            headless: false,
            'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]})
        const reedPage = await browser.newPage();
        
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
        //I set the key to 15 so the keys do not overlap with the indeedPages 
        let reedKey = 64;
        
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
            
            let arrayLength = reedArray.push({
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
            console.log(`scraping reed ${reedKey}`)
            //console.log('reed', reedArray[arrayLength-1])
            res.write(`event: newData\ndata: ${JSON.stringify(reedArray[arrayLength-1])} \n\n`)
            reedKey++;        
            if(arrayLength== reedResults.length){
                res.write(`event: close\ndata: linkedIn\n\n`)
                reedPage.close();
                console.log('closed')
            } 
            }catch(e){
                console.log('error occured in reed search ' + e);
                console.log('couldnt find '+ reedKey)
            }finally{
                reedKey++; 
            }    
        }
            console.log('end')
        }catch(e){
            console.log('error occured in reed search ' + e);
            res.write(`event: error\ndata: reed\n\n`);
                //reedPage.close();
        } finally{
            res.write(`event: close\ndata: reed\n\n`)
                //reedPage.close();
                console.log('closed')
        }
}

async function scrapeJobsite(res, jobSiteUrl){
    let jobSiteArray = []
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

        //I set the key to 40 so the keys do not overlap with the indeedPages 
        let jobsiteKey = 44;
        
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
                const time = timeValue(postedAt);
                location = location.substring(0,location.lastIndexOf(' from')-1)
                
                const arrayLength = jobSiteArray.push({
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
                console.log(`scraping Jobsite ${jobsiteKey}`)
                //console.log('jobSite', jobSiteArray[arrayLength-1])
                res.write(`event: newData\ndata: ${JSON.stringify(jobSiteArray[arrayLength-1])} \n\n`);     
            }catch(e){
                console.log('error occured in jobSite search ' + e);
                console.log('couldnt find '+ jobsiteKey);
            }finally{
                jobsiteKey++;
            }      
        }
            console.log('Jobsite ended')
        }catch(e){
            console.log('error occured in Jobsite search ' + e);
            res.write(`event: error\ndata: jobSite\n\n`);
            //res.write(`event: close\ndata: jobSite\n\n`);
            //jobSitePage.close();
        }finally{
            //jobSitePage.close();
            console.log('jobsite closed')
            res.write(`event: close\ndata: jobSite\n\n`);
        }
}

function scrapeJobs(res, req) {
    
    const searchQuery = req.query.q; 
    const location = req.query.location;
    const sortBy = req.query.sortBy;
    const returnIndeed = req.query.indeed;
    const returnLinked = req.query.linked;

    if(returnIndeed === 'true'){ 
        const sort= (sortBy =='DD')? '&sort=date' : '';
        const url = `https://www.indeed.co.uk/jobs?q=${searchQuery}&l=${location}${sort}`;
        scrapeIndeed(res, url)
    }
    if(returnLinked === 'true'){
        let sort='';
        if(sortBy =='DD'){
            sort= '&sortBy=DD'
        }
        const linkedInUrl = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${location}${sort}`;
        scrapeLinked(res, linkedInUrl)
    }
    if(returnLinked === 'true'){
        let sort='';
        if(sortBy =='DD'){
            sort= '?Sort=2&scrolled=268'
        }
        const jobSiteUrl = `https://www.jobsite.co.uk/jobs/${searchQuery}/in-${location}${sort}`;
        scrapeJobsite(res, jobSiteUrl)
    }
    
    if(returnLinked === 'true'){
        let sort='';
        if(sortBy =='DD'){
            sort= '&sortby=DisplayDate'
        }
        const reedUrl = `https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}?proximity=20&sortby=DisplayDate${sort}`;
        scrapeReed(res, reedUrl)
    }
}

app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      });
