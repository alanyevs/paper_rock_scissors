function GetProfile(UserID) {
    return sdk.profileGet({"UserID": UserID});
}

let playerIDs = null

socket.on("get_room_result", (room_info) => {
    console.log(room_info);
    let room = JSON.parse(room_info);
    playerIDs = room.PlayerIDs;
    console.log(playerIDs);
    playerIDs = playerIDs.split(',');
    PlayerIDs = playerIDs;
    $.each(playerIDs, function(i,data){
        GetProfile(this).then((response) => {
            console.log(response);
            let data = response.data;
            $(".room_player_avatar").eq(i).attr("src", GetAvatarPath(data.AvatarIndex));
            $(".room_player_name").eq(i).html(data.UserName);
        })
        .catch((error) => {
            console.log(error);
        });
    })

    if (playerIDs.length == 2 && playerIDs[0] == UserID) {
        $("#room_start_btn").prop("disabled",false);
    } else {
        $("#room_start_btn").prop("disabled",true);
    }
});

socket.on("refresh_room", () => {
    console.log("refreshing room");
    // window.location.href="../room";
    window.location.reload();
    // socket.emit("get_room", {"GameID": GameID});
})

function start_game() {
    console.log("starting game");
    socket.emit("update_room", {"Status": "Playing", "PlayerIDs": playerIDs});
}

socket.on("start_game_success", () => {
    playerIDs = null
    console.log("starting game sucess");
    window.location.href="/play";
})

function exit_game() {
    console.log("exiting game");
    socket.emit("exit_room", {"Status": "Preparing"});
}

socket.on("exit_room_success", () => {
    playerIDs = null
    window.location.href="/lobby";
})

$(document).ready(function(){
    socket.emit("get_room", {"GameID": GameID});
})