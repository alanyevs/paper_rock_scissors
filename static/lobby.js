let data=[
    {
        "roomid": "1002386",
        "creator": "alanyevs",
        "people": "1/2",
        "game": "PSR"
    }
]

$(document).ready(function(){
    $.each(data, function(i, d){
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
        $("#lobby_container").append(r)
    })
})