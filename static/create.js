
$(document).ready(function() {
    $(document.getElementById('createRoom')).click(function() {
        // TODO: replace the player_id
        console.log('button clicked');
        socket.emit("create_room", {"PlayerID": 'c5a0a4cc-5f15-4218-8b4c-71f2768726ee', "Capacity": "2"});
        // TODO: before jumping into play, anything else needs to pass in?
        window.location.href="../room";
    });
})