const puppeteer = require('puppeteer');

async function scraper(res, site, url, callback, smallSizeQuestion, showCSS, waitForSelector, findItems, startingKey, browser){

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
    }
}


module.exports= scraper;