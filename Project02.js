//1. write requirements
// allow the user to select an NBA team from the drop down menu and display names of nba players of selected team onto page

//Pseudo Code
//on page load make an API call to the /players endpoint
//return an array of player objects
//filter through the array to grab all teams
// create an option element populated by teams in array
    //<option value="">Player Team</option>
//append this function to the dropdown
//add an event listener to our search button wherein .onclick the dropdown selection is searched 
//setting up my namespace thing
const ballApp = {}
ballApp.logos = []
console.log("here")
//popping in my API key
ballApp.apiKey = "969560e0d4msh81fef14da5384b9p13216ejsnec3522a12de8"

//jquery variables
const $dropdown = $('#dropdown');
const $container = $('.stats-container')

//a function responsible for populating our drop-down with NBA teams
ballApp.teamsDropdown = () => {
    //on page load make a netwrok request to API players endpoint
  $.ajax({
    url: "https://api-nba-v1.p.rapidapi.com/teams",
    method: 'GET',
    dataType: 'json',
    headers: {
        "X-RapidAPI-Key": "969560e0d4msh81fef14da5384b9p13216ejsnec3522a12de8",
		"X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com"
    }
}).then((response) => {
    console.log(response)
    response.response.forEach((team) => {
        if (team.nbaFranchise === true && team.allStar === false) {
            const teamName = team.name
            const teamId = team.id;
        
            const teamLogoObject = {
                teamId: team.id,
                teamLogo: team.logo,
                teamName: team.name
            }
            ballApp.logos.push(teamLogoObject)
            
           const htmlToAppend = `
          <option value="${teamId}">${teamName}</option>
          `
           $dropdown.append(htmlToAppend);
        }
    })
});
}
     
//adding event listener to dropdown
ballApp.getStats = () => {
    
    //add an evetn listener to our dropdown
    $dropdown.on ('change', () => {
        //when an option is selected get the logo id from slected options value
        const selection = $('option:selected')
        const value = $('option:selected').val()
        //clear out div before we add in logo and stats info
        $container.empty();
        //make an api call to /teams
        $.ajax({
            url: `https://api-nba-v1.p.rapidapi.com/teams/statistics?season=2021&id=${selection.val()}`,
            method: 'GET',
            dataType: 'json',
            headers: {
                "X-RapidAPI-Key": "969560e0d4msh81fef14da5384b9p13216ejsnec3522a12de8",
                "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com"
             }
        }).then((response) => {
            //creating two variables, one that gets the ID from the statistics endpoint and one that finds the corresponsing ID and logo from the teams endpoint and returns it.
            const statsTeamId = response.parameters.id
            const statsLogo = ballApp.logos.find(logo => {
                return logo.teamId.toString() === statsTeamId 
            })
            const htmlToAppend = 
            `<div class ="statsGoHere">
                <h3>${statsLogo.teamName}</h3>
                <div>
                    <ul> 
                    <li>Three Point Percentage: ${response.response[0].tpp}</li>
                    <li>Field Goal Percentage: ${response.response[0].fgp}</li>
                    <li>Fast Break Points: ${response.response[0].fastBreakPoints}</li>
                    <li>Total Rebounds: ${response.response[0].totReb}</li>
                    <li>Free Throw Percentage: ${response.response[0].ftp}</li>
                    <li>Blocks: ${response.response[0].blocks}</li>
                    <li>Steals: ${response.response[0].steals}</li>
                    <li>Turnovers: ${response.response[0].turnovers}</li>
                    </ul>
                </p>
                </div>
                <img class="logo" src=${statsLogo.teamLogo}>
            </div>
            `
            $(".stats-container").append(htmlToAppend)
        })
    })
}


ballApp.init = () => {
   //ballApp.getPlayers()
ballApp.teamsDropdown();
ballApp.getStats();
//ballApp.getLogo();
}

$(function() {
    ballApp.init();
});






