let data=[
    {
        "rank":"1",
        "user_id":"alanyevs",
        "winning_rate":"20%",
        "games":"200"
    }
]

let update_time = "Feb 27, 2022 16:30PM (EST)"

$(document).ready(function(){
    $("#last_update").html(update_time)
    $.each(data, function(i, d){
        let r = $("<div class='row'>")
        let c = $("<div class='col-1'>")
        c.html(d.rank)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.user_id)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.winning_rate)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.games)
        r.append(c)
        $("#leaderboard_container").append(r)
    })
})