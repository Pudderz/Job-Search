const puppeteer = require('puppeteer');
const express = require('express');
const port = 3000;
let browser;
const app = express()

app.listen(port, async()=>{
    console.log('test')
    
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

function scrapeJobs(res, req) {
  (async () =>{
        let array=[];
        let object={};
        let i = 0;
        //Creates a new page
        let browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
        await page.setViewport({
            width: 1500,
            height: 900,
            deviceScaleFactor: 1,
          });
        //stops page loading css
        page.setRequestInterception(true);
        page.on('request', req=>{
            if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
                req.abort();
            }else{
                req.continue();
            }
        })
        const searchQuery = (req.query.q)? req.query.q : 'Junior+JavaScript'; 
        const location = (req.query.location)? req.query.location: 'london';
        let url = `https://www.indeed.co.uk/jobs?q=${searchQuery}&l=${location}`;
        await page.goto(url);
        await page.waitForSelector('div.jobsearch-SerpJobCard');
        const data = await page.$$('div.jobsearch-SerpJobCard');

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
            console.log(moreInfo);
            array.push({
                'position': position.value,
                'postedAt': postedAt.value,
                'location': location.value,
                'company': company.value,
                'salary': salary,
                'summary': summary.value,
                'link': moreInfo.value,
                'id': i,
                'site': 'indeed',
            });
            res.write(`event: newData\ndata: ${JSON.stringify(array[i])} \n\n`)
            i++;        
            if(i== data.length){
                //res.write(`event: close\ndata: indeed\n\n`)
                //page.close()   
                // completed(true,false);
            } 
        }
        let linkedInUrl = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${location}`
        const linkedInPage = await browser.newPage();
        
        // linkedInPage.on('request', req=>{
        //     if(req.resourceType() === 'stylesheet'|| req.resourceType() === 'font'){
        //         req.abort();
        //     }else{
        //         req.continue();
        //     }
        // })
        const iPhone = puppeteer.devices['iPhone 6']
        await linkedInPage.emulate(iPhone);
        let index = i;
        await linkedInPage.goto(linkedInUrl);
        await linkedInPage.waitForSelector('.job-search-card');
        const linkedInResults = await linkedInPage.$$('ul.jobs-search__results-list > li');
        console.log(linkedInResults.length)
        await linkedInPage.waitForSelector('div.base-search-card__info');
        await linkedInPage.waitForSelector('div.base-search-card__info > h4');
        
        for(results of linkedInResults){
            console.log('scraping linkedIn')
            const company = await results.$eval('h4 > span', node=> node.textContent)
            const location = await results.$eval('div.base-search-card__info > h4', node=> node.textContent)
            const divResults = await results.$('div.base-search-card');
            const position = await divResults.$eval('h3.base-search-card__title', node=> node.textContent)
            const summary = await divResults.$eval('div.base-search-card__info > div > p', node=> node.textContent)
            const postedAt = await divResults.$eval('div.base-search-card__info > div > time', node=> node.textContent)
            //let image = await results.$eval('img', node=> node.map((e) => e.getAttribute('src')));
            const moreInfo = await results.$eval('a.base-search-card__full-link', node=> node.getAttribute('href'));
            console.log(moreInfo);
            index = array.push({
                'position': position,
                'postedAt': postedAt,
                'location': location,
                'company': company,
                'summary': summary,
                'link': moreInfo,
                'id': index,
                'site': 'linkedIn',
                //'image': image,
            });
            console.log('linkedIn', array[index-1])
            res.write(`event: newData\ndata: ${JSON.stringify(array[index-1])} \n\n`)
            index++;        
            if(index-i-2== data.length-1){
                res.write(`event: close\ndata: indeed\n\n`)
                page.close()   
                // completed(true,false);
            } 
            console.log('end')
        }

    })();
}

