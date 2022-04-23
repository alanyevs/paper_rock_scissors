let data = {
    "avatar": "https://m.media-amazon.com/images/I/816p9XkbMQL._SL1427_.jpg",
    "user_id": "alanyevs",
    "winning_rate": "20%",
    "games": "200",
    "level":"17",
    "paper_rate": "20%",
    "scissors_rate": "20%",
    "rock_rate": "20%",
    "recent_games": []
}

$(document).ready(function(){
    $("#user_id").html(data.user_id)
    $("#user_avatar").attr("src",data.avatar)
    $("#total_wr").html(data.winning_rate)
    $("#games").html(data.games)
    $("#level").html(data.level)
    $("#p_wr").html(data.paper_rate)
    $("#r_wr").html(data.rock_rate)
    $("#s_wr").html(data.scissors_rate)
    $.each(data.recent_games, function(i, d){
        let r = $("<div class='row'>")
        let c = $("<div class='col-1'>")
        c.html(d.roomid)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.creator)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.people)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.game)
        r.append(c)
        $("#recent_container").append(r)
    })
})