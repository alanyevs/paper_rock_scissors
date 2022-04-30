socket.on("get_room_result", (room) => {
    console.log(room);
    var room = JSON.parse(room);

    var playerIDs = room.PlayerIDs.split(',');
    for (let i = 0; i < playerIDs.length; i++) {
        var r = $("<div class='row'>");
        var c = $("<div class='col-1'>");
        c.html(playerIDs[i]);
        r.append(c);
        c = $("<div class='col-2'>");
        // TODO: replace the winrate with the one extracted from the user profile
        c.html("100");
        r.append(c);
        $("#room_container").append(r);
    }
});

socket.on("refresh_room", () => {
    window.location.href="../room";
})

$(document).ready(function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // TODO: EMMM, how to implement this?
    var gameID = urlParams.get('gameID');
    gameID = "1831723c-2d26-4e77-a57e-458ab5b553f6";
    socket.emit("get_room", {"GameID": gameID});
})