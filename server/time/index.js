const month= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

const regex = /^\d+/i;
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

const reedTimeValue=(postedAt)=>{
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


module.exports = {reedTimeValue, timeValue}