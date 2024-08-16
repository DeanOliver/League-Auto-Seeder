function LoLSeeder() {

  //* Variables *//
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var sheet = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var teams = [];                                  // An empty array of teams.
  var count = 2;                                   // Just a variable to count rows, starting at row 2.

  for(n=1;n<sheet.length;++n){                     // Create a player object for all the IGNs.
    var teamName = sheet[n][0] ;                   // n=row, x=column
    var IGN = sheet[n][1] ;                        // n=row, x=column    
    var player = CreatePlayerObject(IGN);          // Create a player with all their ranked info.

    //Logger.log(player);
    teams = player2Teams(player, teamName, teams); // Add player to their team + create team is doesn't exist.
  }


  teams = orderTeamsByRank(teams);                 // Order teams by player ranks
 
  // Print the data onto the sheet
  for(i=0;i<(teams.length);++i){
    for(p=0; p<teams[i].players.length;++p){
      activeSheet.getRange(count,1).setValue([teams[i].teamName]);
      activeSheet.getRange(count,2).setValue([teams[i].players[p].ign]);
      activeSheet.getRange(count,3).setValue([
      teams[i].players[p].tier + " " + 
      teams[i].players[p].division + " " + 
      teams[i].players[p].lp + "LP"]);
      activeSheet.getRange(count,4).setValue([teams[i].players[p].rankValue]);  
      activeSheet.getRange(count,5).setValue([teams[i].avrageRankScore]);
      count++;
    }
  }
  return;
}


function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Auto Seeder')
      .addItem('Seed By IGN','LoLSeeder')
      .addToUi();
}