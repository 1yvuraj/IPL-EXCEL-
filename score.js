const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
console.log("Before");

function processSingleMatch(url) {
  request(url, cb)
}

function cb(error, respose, html) {
  if (error) {
    console.log(error);
  } else if (respose.statusCode == 404) {
    console.log("Page Not Found");
  } else {
    dataExtractor(html);
  }
}




function dataExtractor(html){
    let $ = cheerio.load(html);
    let description = $(".event .description");
    let result = $(".event .status-text");
    let strArr = description.text().split(",");
    let venue = strArr[1].trim();
    let date = strArr[2].trim();
    let res = result.text();
  
    let innings = $(".Collapsible");
  //  let htmlContent = "";
    for (let i = 0; i < innings.length; i++) {
    // htmlContent = $(innings[i]).html();

    // teamname and opponent name
     let teamNameElem = $(innings[i]).find("h5");
     let teamName = teamNameElem.text();
     teamName=teamName.split("INNINGS")[0];
     teamName =teamName.trim();
     let opponentIdx = i == 0? 1 : 0;
     let oppteamName = $(innings[opponentIdx]).find("h5").text();
     oppteamName=oppteamName.split("INNINGS")[0];
     oppteamName =oppteamName.trim();
     // done with team name
    console.log(`${venue}| ${date}| ${teamName}| ${oppteamName}| ${res}`)
     // fs.writeFileSync(`innings${i+1}.html`,htmlContent);

     let tableElement = $(innings[i]).find(".table.batsman tbody tr");
     for(let j=0;j<tableElement.length;j++){
         let numberofTds = $(tableElement[j]).find("td");
         if(numberofTds.length==8){
          let name = $(numberofTds[0]).text();
          let runs = $(numberofTds[2]).text();
          let balls = $(numberofTds[3]).text();
          let fours = $(numberofTds[5]).text();
          let sixes = $(numberofTds[6]).text();
          let sr = $(numberofTds[7]).text();
            //console.log(playerNames);
            let data = `PlayerName =  ${name}  | runs= ${runs} | balls=${balls} | fours =${fours}   | sixes=${sixes}   | sr=${sr}  `;
            console.log(data)
            processPlayer(teamName, name, runs, balls, fours, sixes, sr, oppteamName, venue, date, res);
        }
     }
     console.log("-----------------------------------------")
    }
   
}

function processPlayer(teamName, name, runs, balls, fours, sixes, sr, oppteamName, venue, date, res){
  let teamPath = path.join(__dirname,"ipl",teamName);
  dirCreator(teamPath);
  let filePath = path.join(teamPath,name+".xlsx");
  let content = excelReader(filePath,name);
  let playerObj = {
    teamName,
    name,
    runs,balls,fours,sixes,
    sr,
    oppteamName,
    venue,date,
    res
  }
  content.push(playerObj);
  excelWriter(filePath,content,name);
}

function dirCreator(filePath){
  if(fs.existsSync(filePath)==false){
  fs.mkdirSync(filePath);
  }
}

function excelWriter(filePath, json, sheetName) {

  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) {
      return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;

}

module.exports ={
  processSingleMatch
}
