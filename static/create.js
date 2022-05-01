socket.on("room_created", () => {
    // TODO: before jumping into play, anything else needs to pass in?
    window.location.href="../room";
})

$(document).ready(function() {
    $(document.getElementById('createRoom')).click(function() {
        // TODO: replace the player_id
        console.log('button clicked');
        socket.emit("create_room", {"PlayerID": UserID, "Capacity": "2"});
    });
})