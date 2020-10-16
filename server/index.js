const puppeteer = require('puppeteer');
const express = require('express');
//dotenv allows us to declare environment variables in a .env file
require("dotenv").config();
const path = require('path');
const { resolve } = require('path');
const port = process.env.PORT || 8080;
const month= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
const app = express()
const regex = /^\d+/i;
app.listen(port);


app.use(express.static('public'))

app.get('/stream', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    "Access-Control-Allow-Origin": "*",

  })
  console.log('Scraping started');
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

const reedTimeValue=postedAt=>{
    let firstWord = postedAt.match(/[a-z,A-Z]+/i);
    const numberMonth = month.indexOf(firstWord[0]);
    if(numberMonth !== -1){
        let jobDay = (regex.test(postedAt))? postedAt.match(/^\d+/i) : 1;
        let currentDate = new Date();
        let jobDate = new Date();
        jobDate.setMonth(numberMonth);
        jobDate.setDate(jobDay)
        const diffTime = Math.abs(currentDate - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return [diffDays, diffDays + " days ago"]
    } else{
        return [timeValue(postedAt) , postedAt]
    }
}

async function scraper(res, site,browser,completeCallback, url, callback, smallSizeQuestion, showCSS, waitForSelector, findItems, startingKey){
    console.log('scraper function running');
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
        console.log(`error occured in ${site} search and couldnt be processed or no results shown ${e}`);
        res.write(`event: error\ndata: ${site}\n\n`);
    }finally{
        res.write(`event: close\ndata: ${site}\n\n`);
         await page.close();
        console.log(`${site} Page finished and closed, ${key-numOfErrors-startingKey}/${key-startingKey}  scraped`);
        completeCallback(site);    
    }
}

async function indeed(info, indeedKey){
   
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



async function createbrowser(){
    console.log('opening browser')
    return await puppeteer.launch({headless: true,
        'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
        ]})
}
function  scrapeJobs(res, req, browser) {
    const isLoaded={
        'indeed':(req.query.indeed !== 'true'),
        'reed':(req.query.reed !== 'true'),
        'jobSite':(req.query.jobsite !== 'true'),
    }
    
    const isComplete= async(site)=>{
        
        isLoaded[site] = true;
        if(isLoaded['indeed']&&isLoaded['reed']&& isLoaded['jobSite']){
           await browser.close();
        }
    }

    const searchQuery = req.query.q; 
    const location = req.query.location;
    const sortBy = req.query.sortBy;
    console.log('starting');
   
    if(!isLoaded['indeed']){ 
        console.log('indeed running');
        const url = new URL('https://www.indeed.co.uk/jobs');
        if(sortBy =='DD')url.searchParams.set('sort', 'date');
        if(req.query.iJob)url.searchParams.set('jt', req.query.iJob);
        if(req.query.iDate)url.searchParams.set('fromage', req.query.iDate);
        if(req.query.iRad)url.searchParams.set('radius', req.query.iRad);
        if(req.query.iSal){
            url.searchParams.set('q', `${searchQuery}+${req.query.iSal}`);
        }else url.searchParams.set('q', `${searchQuery}`);

        scraper(res,'indeed',browser,isComplete, url, indeed, false, false, 'div.jobsearch-SerpJobCard','div.jobsearch-SerpJobCard', 0 );
    }
        
    
    
    if(!isLoaded['jobSite']){
        const jobType = (req.query.jJob)? `${req.query.jJob}/` : '';

        const url = new URL(`https://www.jobsite.co.uk/jobs/${jobType}${searchQuery}/in-${location}`);
        if(sortBy =='DD')url.searchParams.set('Sort', '2');
        if(sortBy =='DD')url.searchParams.set('scrolled', '268');
        if(req.query.jDate)url.searchParams.set('postedwithin', req.query.jDate);
        if(req.query.jRad)url.searchParams.set('radius', req.query.jRad);
        if(req.query.jSal){
            url.searchParams.set('salary', req.query.jRad);
            url.searchParams.set('salarytypeid', '1');
        }
        scraper(res, 'jobSite',browser,isComplete, url, jobsite, true, true,'div.job','div.job.twinpeaks', 16 );
    }
        
    if(!isLoaded['reed']){
        console.log('reed true')
        let sort=(sortBy =='DD')?'&sortby=DisplayDate' :'';
        const url = new URL(`https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}${sort}`);
        if(req.query.rJob )url.searchParams.set(req.query.rJob, 'true');
        if(req.query.rRad )url.searchParams.set('proximity', req.query.rRad);
        if(req.query.rSal )url.searchParams.set('salaryfrom', req.query.rSal);
        if(req.query.rDate )url.searchParams.set('datecreatedoffset',req.query.rDate);

        if(sortBy =='DD')url.searchParams.set('sort');
        scraper(res, 'reed',browser,isComplete, url, reed, true, false, 'article.job-result', 'article.job-result', 37);
    }
    console.log(isLoaded)   
    console.log('end')
    
}
async function sortScraping(res, req){
    const browser = await createbrowser();
    console.log(browser);
    await scrapeJobs(res, req, browser);
}

app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      });
