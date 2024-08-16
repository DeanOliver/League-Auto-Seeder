/***************************************************************************************************************
* Name: player2Teams     Args: A Player object, The players team name, An array of existing team objects.      *
* Info: Adds players to their teams. If the team does not exists it creates the team and then adds them to it. *
*       There is no curation of players, this allows for duplicate players and infinite team sizes.            *
***************************************************************************************************************/
function player2Teams(player, teamName, teams){
  var teamMatch = false;

  if(teams.length == 0){                              // If no teams exist create the first.
    teams.push(createTeamObject(teamName, teams));
  }
  
  for(t=0;t<teams.length;++t){                        // Cycle through every team.
    if(teams[t].teamName == teamName){                // If the team exists add player.
      teams[t].players.push(player);                  // Add player to the team.
      teamMatch = true;                               // Set a flag to know we have found a matching team.
      break;
    }
  }

  if(teamMatch == false){                             // If we have not found a matching team.
      teams.push(createTeamObject(teamName));
      player2Teams(player, teamName, teams);          // Recall the function to add player to the new team.
  }
  return teams;
}

/***************************************************************************************************************
* Name: createTeamObject     Args: The name of a team.                                                         *
* Info: Creats a team and adds it to the teams array                                                           *
***************************************************************************************************************/
function createTeamObject(teamName){
  var team ={
    teamName:teamName,                                // String - The name of the team.
    players:[],                                       // Object Array - Empty array of players.
    avrageRankScore: 0                                // Int - Points based on average rank of the team's 5 best players.
  } 
  return team;
}

/***************************************************************************************************************
* Name: orderTeamsByRank     Args: An array of existing team objects.                                          *
* Info: Orders teams by their players ranks.                                                                   *
***************************************************************************************************************/
function orderTeamsByRank(teams){
  for(t=0;t<teams.length;++t){                        // Cycle through every team.
    teams[t] = scoreTeam(teams[t]);                   // Get the total ranked scores of the team's best players.
  }

  teams.sort((a, b) => {                              // Sort teams by their avrage rank score.
      return b.avrageRankScore - a.avrageRankScore;
  })
  return teams;
}

/***************************************************************************************************************
* Name: scoreTeam     Args: A Team object.                                                                     *
* Info: Give teams a scores based on their top 5 players ranks.                                                *
***************************************************************************************************************/
function scoreTeam(team){
  var teamScore = 0;                                    // Sum of the top 5 players ranked scores.
  var teamAverageScore = 0;                             // Average score of top 5 players rank scores.
  
  if(team.players.length > 5){                          // If the team has more than 5 players.
    team.players.sort((a, b) => {                       // Sort players in the team by ranked score
      return b.rankValue - a.rankValue;
    })

    for(p=0;p<5;++p){                                   // Loop through the top 5 players.
      teamScore += team.players[p].rankValue;           // Total the score of the top 5 players.
    }
    teamAverageScore = teamScore / 5;                   // Calculate the average rank score.
  }
  else{
    for(p=0;p<team.players.length;++p){                 // Loop through the team's players.
      teamScore += team.players[p].rankValue;           // Total the score of the team's players.
    }
    teamAverageScore = teamScore / team.players.length; // Calculate the average rank score.
  }

  team.avrageRankScore = teamAverageScore;
  return team;
}