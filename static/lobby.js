function joinRoom(gameID){
    socket.emit("update_gameid", {"GameID": gameID});
    socket.emit("join_room", {"GameID": gameID, "PlayerID": UserID});
}

socket.on("join_room_success", () => {
    window.location.href="../room";
})

socket.on("join_room_failed", () => {
    alert("The number of people in the room has reached the capacity and you can't join the game.");
})

function GetProfile(UserID) {
    return sdk.profileGet({"UserID": UserID});
}

socket.on("list_rooms_results", (rooms) => {
    $("#lobby_container").empty()
    console.log(rooms);
    var rooms = JSON.parse(rooms);

    for (let i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        var playerIDs = room.PlayerIDs.split(',');
        GetProfile(playerIDs[0])
        .then((response) => {
            console.log(response);
            var room = rooms[i];
            var playerIDs = room.PlayerIDs.split(',');
            var gameID = room.GameID;
            var len = playerIDs.length;
            let data = response.data;
            var r = $("<div class='row'>");
            var c = $("<div class='col-1'>");
            c.html(i.toString());
            r.append(c);
            c = $("<div class='col-2'>");
            c.html(data.UserName);
            r.append(c);
            c = $("<div class='col-2'>");
            c.html(len.toString() + "/" + room.Capacity);
            r.append(c);
            c = $("<div class='col-2'>");
            c.html(room.Status);
            r.append(c);
            c = $("<div class='offset-4 col-1 p-0'>");
            // c.css("margin-right","0")
            let b = $('<button type="button" class="btn" onclick="joinRoom(\'' +gameID+ '\')">Join</button>');
            b.css("width","100%")
            c.append(b);
            r.append(c);
            $("#lobby_container").append(r);
        })
        .catch((error) => {
            console.log(error);
        });   
    }
});

$(document).ready(function(){
    socket.emit("list_rooms", {});
})