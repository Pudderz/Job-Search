const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();


app.listen(port, ()=>{
    console.log('test')
})

app.use(cors());
app.get('/', function(req, res){
    (async () =>{
        let array=[];
        const browser = await puppeteer.launch({headless: false})
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

        let location = 'london';
        let searchQuery = 'Junior+JavaScript';
        let url = `https://www.indeed.co.uk/jobs?q=${searchQuery}&l=${location}/`;
        await page.goto(url);
        await page.waitForSelector('title');
        const title = await page.title();
        await page.mouse.move(40,150);
        console.log(`The title is ${title}`);
        
        await page.waitForSelector('table#resultsBody');
        await page.waitForSelector('div.jobsearch-SerpJobCard');
        
        const data = await page.$$('div.jobsearch-SerpJobCard')
        data.forEach(async (info, index) => {
            
            let postedAt = await info.$eval('.date', date => date.textContent);
            let company = await info.$eval('.company', date => date.textContent);
            let salary = await info.$('.salary');
            if(salary){
                salary = await salary.evaluate(node => node.textContent)
            }
            let location = await info.$eval('.location', date => date.textContent)
            let summary = await info.$eval('.summary', date => date.textContent);
            let moreInfo = await info.$$eval('h2>a', node => node.map((e) => e.getAttribute('href')));
            let position = await info.$$eval('h2>a', node => node.map((e) => e.getAttribute('title')));
            console.log(moreInfo);
            array.push({
                'position': position,
                'postedAt': postedAt,
                'location': location,
                'company': company,
                'salary' : salary,
                'summary': summary,
                'link': moreInfo,
            });
            if(index== data.length-1){
               res.send(JSON.stringify(array)); 
               console.log(array);
                page.close();
            }
        })
    })();
})


