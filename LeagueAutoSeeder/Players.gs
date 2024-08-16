/* 
https://developer.riotgames.com/apis#summoner-v4 - Get the "id" by summoner name /lol/summoner/v4/summoners/by-name/{summonerName}
https://developer.riotgames.com/apis#league-v4 - Get ranks using encryped id /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
 */
function CreatePlayerObject(IGN) {

  var player = {
    ign:"",                   // String - Players In Game Name.         
    encryptedId:"",           // String - encrypted Id from RIOT API.
    tier:"",                  // String - The players ranked tier.
    division:"",              // String - The players ranked division within a tier.
    lp:0,                     // Int - The players ranked league points within a division.
    rankValue:0               // Int - A numerical value equivalent to the players rank. See Config.gs.
  }

  player.ign = IGN;
  player.encryptedId = getEncrypedId(player.ign);  
  if(player.encryptedId == 'undefined' || !player.encryptedId){
    player.encryptedId = 'Bad IGN';
  }

  var rankData = getSoloQRank(player.encryptedId); 
  if(rankData !== 'undefined' && rankData){
    player.tier = rankData['tier'];
    player.division= rankData['division'];
    player.lp = rankData['lp'];
    player.rankValue = ranks[player.tier + " " + player.division];
  }
  else{
    player.tier = 'UNRANKED';
    player.division= 'IV';
    player.lp = 0;
    player.rankValue = ranks[player.tier + " " + player.division];
  }
    
  return player;
}

// Gets a players encrypted id based on their IGN
function getEncrypedId(IGN) {
  try {
    var response = UrlFetchApp.fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/`+IGN+`?api_key=${apiKey}`);
    var JSONresp = JSON.parse(response.getContentText());
    return JSONresp["id"];
  } catch (error) {
    Logger.log(error);
  }
}

// Gets a players Solo Queue ranks based on their encrypted id
function getSoloQRank(encryptedId){

  var isRanked = 0; // Flag to mark a player as having a rank in the standard ranked playlist "RANKED_SOLO_5x5"

  try {
    var ranking = {
    tier:"",
    division:"",
    lp:0
    }   

    var response = UrlFetchApp.fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/`+encryptedId+`?api_key=${apiKey}`);
    var JSONresp = JSON.parse(response.getContentText());

    if(JSONresp.length == 0){
      ranking.tier = 'UNRANKED';
      ranking.division = 'IV';
      ranking.lp = 0;
    }else{     
      for(j=0;j<JSONresp.length;++j){
        if(JSONresp[j]["queueType"] == 'RANKED_SOLO_5x5'){
          ranking.tier = JSONresp[j]["tier"];
          ranking.division = JSONresp[j]["rank"];
          ranking.lp = JSONresp[j]["leaguePoints"];
          isRanked = 1;
        }
      }
      // If the player is ranked but not in the standard game mode
      if(isRanked == 0){
        ranking.tier = 'UNRANKED';
        ranking.division = 'IV';
        ranking.lp = 0;
      }
    }
    return ranking;
  } 
  catch (error) {
    console.error(error);
  }
}