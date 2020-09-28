const puppeteer = require('puppeteer');
const express = require('express');
//dotenv allows us to declare environment variables in a .env file
require("dotenv").config();
const path = require('path');
const port = process.env.PORT || 8080;
let browser;
const app = express()
const regex = /^\d+/i;
app.listen(port, async()=>{
    console.log(`listening on : ${port}`)
    browser = await puppeteer.launch({
        headless: false,
        'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]})
})


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
        if(unitOfTime[0] === 'days' || unitOfTime[0] === 'day'){
            time = +TimeNum[0];
        }else if(unitOfTime[0] === 'weeks' || unitOfTime[0] === 'week'){
            time = (+TimeNum[0])*7;
        }else if(unitOfTime[0]==='months' || unitOfTime[0] === 'month'){
            time = +TimeNum[0]*31;
        } else{
            time = 0;
        }
    }
    return time;
}
function scrapeJobs(res, req) {
    let indeedArray=[];
    const searchQuery = req.query.q; 
    const location = req.query.location;
   try{ 
  (async () =>{
      try{
        let key = 0;
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
        
        let url = `https://www.indeed.co.uk/jobs?q=${searchQuery}&l=${location}`;
        await indeedPage.goto(url);
        await indeedPage.waitForSelector('div.jobsearch-SerpJobCard');
        const data = await indeedPage.$$('div.jobsearch-SerpJobCard');
        for(info of data){
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
                'id': key,
                'site': 'indeed',
                'time': time,
            });
            res.write(`event: newData\ndata: ${JSON.stringify(indeedArray[arrayLength-1])} \n\n`)
            key++;        
            if(key== data.length){
                res.write(`event: close\ndata: indeed\n\n`)
                indeedPage.close()   
            } 
        }
    }catch(e){
        console.log('error occured in indeed search ' + e)
    }
    })();
    (async()=>{
        try{
        let linkedInArray = []
        if(!browser)browser = await puppeteer.launch({
            headless: false,
            'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]})
        const linkedInPage = await browser.newPage();
        
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
        //I set the key to 15 so the key doesnt overlap with the indeedPages 
        let key = 15;
        let linkedInUrl = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${location}`
        
        
        await linkedInPage.goto(linkedInUrl);
        await linkedInPage.waitForSelector('.job-search-card');
        const linkedInResults = await linkedInPage.$$('ul.jobs-search__results-list > li');
        await linkedInPage.waitForSelector('div.base-search-card__info');
        await linkedInPage.waitForSelector('div.base-search-card__info > h4');
        
        for(results of linkedInResults){
            let [company,location,position,summary,postedAt,moreInfo ] = await Promise.allSettled([
                //Used here*:first-child and *:last-child as company can either
                //be <span> or a <a> tag while location is span and both don't have
                //any without any distintive class names
                await results.$eval('div.base-search-card__info > h4 > *:first-child', node=> node.textContent),
                await results.$eval('div.base-search-card__info > h4 > *:last-child', node=> node.textContent),
                await results.$eval('div.base-search-card__info > h3.base-search-card__title', node=> node.textContent),
                await results.$eval('div.base-search-card__info > div.base-search-card__metadata > p', node=> node.textContent),
                await results.$eval('div > time', node=> node.textContent),
                await results.$eval('a.base-search-card__full-link', node=> node.getAttribute('href')),
            ])
            console.log('scraping linkedIn')
            
           
         
            //let image = await results.$eval('img', node=> node.map((e) => e.getAttribute('src')));
           
            
            
            const time = timeValue(postedAt.value);
            
            let arrayLength = linkedInArray.push({
                'position': position.value,
                'postedAt': postedAt.value,
                'location': location.value,
                'company': company.value,
                'summary': summary.value,
                'link': moreInfo.value,
                'id': key,
                'site': 'linkedIn',
                'time': time,
                //'image': image,
                //'company link'
                //rating

            });
            console.log('linkedIn', linkedInArray[arrayLength-1])
            res.write(`event: newData\ndata: ${JSON.stringify(linkedInArray[arrayLength-1])} \n\n`)
            key++;        
            if(key-15== linkedInResults.length){
                res.write(`event: close\ndata: linkedIn\n\n`)
                //linkedInPage.close();
                console.log('closed')
            } 
        }
        console.log('end')
        }catch(e){
            console.log('error occured in LinkedIn search ' + e)

        }
    })();
    }catch(e){
        console.log('error occured in search ' + e)
    }
}
app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      });
