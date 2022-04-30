function GetProfile(UserID) {
    return sdk.profileGet({"UserID": UserID});
}

socket.on("get_room_result", (room) => {
    console.log(room);
    var room = JSON.parse(room);
    var playerIDs = room.PlayerIDs.split(',');
    for (let i = 0; i < playerIDs.length; i++) {
        GetProfile(playerIDs[i])
        .then((response) => {
            console.log(response);
            let data = response.data;
            var r = $("<div class='row'>");
            var c = $("<div class='col-1'>");
            c.html(data.UserName);
            r.append(c);
            c = $("<div class='col-2'>");
            // TODO: replace the winrate with the one extracted from the user profile
            c.html("100");
            r.append(c);
            $("#room_container").append(r);
        })
        .catch((error) => {
            console.log(error);
        });
    }
});

socket.on("refresh_room", () => {
    console.log("refreshing room");
    window.location.href="../room";
})

$(document).ready(function(){
    socket.emit("get_room", {"GameID": GameID});
})