function  whatJobsToScrape(res, req) {
    
    const searchQuery = req.query.q; 
    const location = req.query.location;
    const sortBy = req.query.sortBy;


    if(req.query.indeed === 'true'){ 
        const url = new URL('https://www.indeed.co.uk/jobs');
        if(sortBy =='DD')url.searchParams.set('sort', 'date');
        if(req.query.iJob)url.searchParams.set('jt', req.query.iJob);
        if(req.query.iDate)url.searchParams.set('fromage', req.query.iDate);
        if(req.query.iRad)url.searchParams.set('radius', req.query.iRad);
        if(req.query.iSal){
            url.searchParams.set('q', `${searchQuery}+${req.query.iSal}`);
        }else url.searchParams.set('q', `${searchQuery}`);
        scraper(res,'indeed', url, indeed, false, false, 'div.jobsearch-SerpJobCard','div.jobsearch-SerpJobCard', 0,browser );
    }

    if(req.query.linked === 'true'){
        
        const url = new URL(`https://www.linkedin.com/jobs/search`);
        url.searchParams.set('keywords', searchQuery);
        url.searchParams.set('location', location);
        if(sortBy =='DD')url.searchParams.set('sortBy', 'DD');
        if(req.query.lJob )url.searchParams.set('f_JT', req.query.lJob);
        if(req.query.lDate )url.searchParams.set('f_TP', decodeURIComponent(req.query.lDate));
        scraper(res,'linkedIn', url, linkedIn, true, false, '.job-result-card', 'ul.jobs-search__results-list > li', 19, browser);
    }
    
    if(req.query.jobsite === 'true'){
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
        //const jobSiteUrl = `https://www.jobsite.co.uk/jobs/${jobType}${searchQuery}/in-${location}?${sort}${datePosted}${salary}${radius}`;
        scraper(res, 'jobSite', url, jobsite, true, true,'div.job','div.job.twinpeaks', 44, browser )
    }
    
    if(req.query.reed === 'true'){
        let sort=(sortBy =='DD')?'&sortby=DisplayDate' :'';
        const url = new URL(`https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}${sort}`);
        if(req.query.rJob )url.searchParams.set(req.query.rJob, 'true');
        if(req.query.rRad )url.searchParams.set('proximity', req.query.rRad);
        if(req.query.rSal )url.searchParams.set('salaryfrom', req.query.rSal);
        if(req.query.rDate )url.searchParams.set('datecreatedoffset',req.query.rDate);

        if(sortBy =='DD')url.searchParams.set('sort');
        //const reedUrl = `https://www.reed.co.uk/jobs/${searchQuery}-jobs-in-${location}?${salary}${radius}${jobType}${datePosted}${sort}`;
        scraper(res, 'reed', url, reed, true, false, 'article.job-result', 'article.job-result', 65, browser);
        //scrapeReed(res, reedUrl)
    }
}


module.exports = whatJobsToScrape;