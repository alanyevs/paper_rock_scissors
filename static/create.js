socket.on("room_created", () => {
    window.location.href="../room";
})

$(document).ready(function() {
    $(document.getElementById('createRoom')).click(function() {
        console.log('button clicked');
        socket.emit("create_room", {"PlayerID": UserID, "Capacity": "2"});
    });
})