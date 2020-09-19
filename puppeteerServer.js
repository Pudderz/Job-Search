const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();
let browser;

app.listen(port, async()=>{
    console.log('test')
    browser = await puppeteer.launch({headless: false})
})

app.use(cors());

app.get('/', function(req, res){
    (async () =>{
        let array=[];
        
        //creates a new page
        const page = await browser.newPage();

        //stops page loading css
        page.setRequestInterception(true);
        page.on('request', req=>{
            if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
                req.abort();
            }else{
                req.continue();
            }
        })
        let searchQuery = 'Junior+JavaScript';
        if(req.query.q) searchQuery = req.query.q; 
        let location = 'london';
        if(req.query.location) location = req.query.location;
        let url = `https://www.indeed.co.uk/jobs?q=${searchQuery}&l=${location}`;
        await page.goto(url);
        await page.waitForSelector('title');
        const title = await page.title();
        await page.mouse.move(40,150);
        console.log(`The title is ${title}`);
        
        await page.waitForSelector('table#resultsBody');
        await page.waitForSelector('div.jobsearch-SerpJobCard');
        
        const data = await page.$$('div.jobsearch-SerpJobCard')
        data.forEach(async (info, index) => {
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
            console.log(moreInfo);
            array.push({
                'position': position.value,
                'postedAt': postedAt.value,
                'location': location.value,
                'company': company.value,
                'salary' : salary,
                'summary': summary.value,
                'link': moreInfo.value,
            });
            if(index== data.length-1){
               res.send(JSON.stringify(array)); 
               console.log(array);
            //    page.close() 
            }
        })
        let linkedInUrl = 'https://www.linkedin.com/jobs/search?keywords=Apple&location=london'
        const linkedInPage = await browser.newPage();
        await linkedInPage.goto(linkedInUrl)
    })();
})


