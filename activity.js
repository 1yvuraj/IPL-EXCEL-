let  Cheerio  = require("cheerio");
let request= require("request");
let fs=require("fs");
let path=require("path");
let score = require("./score");



//request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard',cb);
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let iplpath=path.join(__dirname,"ipl");
dirCreater(iplpath);
request(url,match);
function match(error,response,html){
    if(error)
    {
        console.log(error);
    }
    else if (response.statuscode==404)
    {
        console.log("page not found");
    }
    else
    {
        //console.log(html);
        dataExtracter(html);
      
    }
}
function dataExtracter(html)
{
    let searchtool= Cheerio.load(html);
    let tag = searchtool('a[data-hover="View All Results"]');
    let link= tag.attr("href");
    let fullmatchpagecb= `https://www.espncricinfo.com${link}`;

        request(fullmatchpagecb,allmatchpagecb);


    
    
}
function allmatchpagecb(error,response,html){
    if(error)
    {
        console.log(error);
    }
    else if (response.statuscode==404)
    {
        console.log("page not found");
    }
    else
    {
        //console.log(html);
     getAllScoreCard(html);
      
    }
}
function getAllScoreCard(html)
{
    let searchtool= Cheerio.load(html);
     let scorecardarr= searchtool("a[data-hover='Scorecard']");
     for(let i=0;i<scorecardarr.length;i++){
         let link=searchtool(scorecardarr[i]).attr("href");
         let FullallMatchPageLink=`https://www.espncricinfo.com${link}`;
         //console.log(FullallMatchPageLink);
        
         score.processSingleMatch(FullallMatchPageLink);
  
 
    }    
}
function dirCreater(filepath)
{
    if(fs.existsSync(filepath)==false)
    {
        fs.mkdirSync(filepath);
    }
}