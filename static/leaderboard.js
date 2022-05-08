let update_time = "Feb 27, 2022 16:30PM (EST)"

function GetRank() {
    return sdk.leaderboardGet({}, {}, {});
}

$(document).ready(function(){
    $("#last_update").html("Last update: " + update_time)
    GetRank()
    .then((response) => {
        console.log(response);
        let data = response.data.body;
        $.each(data, function(i, d){
            let r = $("<div class='row'>")
            let c = $("<div class='col-1'>")
            c.html(d.Rank)
            r.append(c)
            c = $("<div class='col-2'>")
            c.html(d.UserName)
            r.append(c)
            c = $("<div class='col-2'>")
            c.html(d.Score)
            r.append(c)
            c = $("<div class='col-2'>")
            c.html(d.GamesCount)
            r.append(c)
            $("#leaderboard_container").append(r)
        })
    })
    .catch((error) => {
        console.log(error);
    });
})