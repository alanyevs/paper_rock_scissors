function option_click(){
    $(".option").css("visibility","hidden")
    $(this).css("visibility","visible")
    $(".option").off('click')
    socket.emit("my_action",$(this).attr("op"))
}

$(document).ready(function(){
    socket.on('play_status', function(status) {
        console.log(status)
        $("#opponent_action_container").empty()
        if (status.opponent == "waiting") {
            $("#opponent_action_container").html(waiting_elements)
        } else if (["paper","rock","scissors"].includes(status.opponent)) {
            $("#opponent_action_container").html(opponent_option_element)
            $("#opponent_option").attr("src",sucai_path+"/"+status.opponent+".svg")
        }

        if (status.me == "waiting") {
            $("#my_action_container").empty()
            $("#my_action_container").html(options_elements)
            $(".option").css("visibility","visible")
            $(".option").click(option_click)
        }

        $("#opponent_score").attr("src",sucai_path+"/score"+status.opponent_score+".png")
        $("#my_score").attr("src",sucai_path+"/score"+status.my_score+".png")

    });

    $(".option").click(option_click)

})