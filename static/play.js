function option_click(){
    $(".option").css("visibility","hidden")
    $(this).css("visibility","visible")
    $(".option").off('click')
    socket.emit("my_action",{"action": $(this).attr("op"), "round":round})
}

socket.on("end_game_success", function(records) {
    records = JSON.parse(records);
    // $.each(records, function(i, record){
        
    // })
})

function exit_game() {
    // socket.emit("exit_room", {"Status": "Deleting"});
}

$(document).ready(function(){
    socket.on('test', function(data) {
        console.log(data)
    })

    socket.on('play_status', function(status) {
        console.log(status)
        
        $("#opponent_action_container").html(opponent_option_element)
        $("#opponent_option").attr("src",sucai_path+"/"+status.op_action+".svg")

        setTimeout(function(){
            $("#opponent_action_container").empty()
            $("#opponent_action_container").html(waiting_elements)

            $("#my_action_container").empty()
            $("#my_action_container").html(options_elements)
            $(".option").css("visibility","visible")
            $(".option").click(option_click)

            $("#opponent_score").attr("src",sucai_path+"/score"+status.op_score+".png")
            $("#my_score").attr("src",sucai_path+"/score"+status.my_score+".png")

            round = status.round
            $("#round_number").empty()
            $("#round_number").html(round)
        },2000); 

    });

    $(".option").click(option_click)

})