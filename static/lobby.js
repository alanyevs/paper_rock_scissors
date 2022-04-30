function joinRoom(gameID){
    socket.emit("update_gameid", {"GameID": gameID});
    socket.emit("join_room", {"GameID": gameID, "PlayerID": UserID});
    window.location.href="../room";
}

function getUserName(user_id) {
    console.log(user_id);
    var response = sdk.profileGet({"UserID": user_id});
    var data = response.data;
    return data.UserName;
}

socket.on("list_rooms_results", (rooms) => {
    console.log(rooms);
    var rooms = JSON.parse(rooms);

    for (let i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        var playerIDs = room.PlayerIDs.split(',');
        var gameID = room.GameID;
        var len = playerIDs.length;
        var r = $("<div class='row'>");
        var c = $("<div class='col-1'>");
        c.html(i.toString());
        r.append(c);
        c = $("<div class='col-2'>");
        c.html(getUserName(playerIDs[0]));
        r.append(c);
        c = $("<div class='col-2'>");
        c.html(len.toString() + "/" + room.Capacity);
        r.append(c);
        c = $("<div class='col-2'>");
        c.html(room.Status);
        r.append(c);
        c = $("<div class='col-3'>");
        r.append(c);
        c = $('<button type="button" class="btn" onclick="joinRoom(\'' +gameID+ '\')">Join</button>');
        r.append(c);
        $("#lobby_container").append(r);
    }
});

$(document).ready(function(){
    socket.emit("list_rooms", {});
})