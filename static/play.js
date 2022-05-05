function option_click(){
    $(".option").css("visibility","hidden")
    $(this).css("visibility","visible")
    $(".option").off('click')
    socket.emit("my_action",{"action": $(this).attr("op"), "round":round})
}

function EndGame() {
    pass
}


$(document).ready(function(){
    socket.on('test', function(data) {
        console.log(data)
    })

    socket.on('play_status', function(status) {
        console.log(status)
        
        $("#opponent_action_container").html(opponent_option_element)
        $("#opponent_option").attr("src",sucai_path+"/"+status.op_action+".svg")

        if (status.res == "win") {
            $("#my_action_container").addClass("svg-shadow shadow-success shadow-intensity-lg")
            $("#opponent_action_container").addClass("svg-shadow shadow-danger shadow-intensity-lg")
        } else if (status.res == "lose") {
            $("#opponent_action_container").addClass("svg-shadow shadow-success shadow-intensity-lg")
            $("#my_action_container").addClass("svg-shadow shadow-danger shadow-intensity-lg")
        } else if (status.res == "draw") {
            $("#opponent_action_container").addClass("svg-shadow shadow-warning shadow-intensity-lg")
            $("#my_action_container").addClass("svg-shadow shadow-warning shadow-intensity-lg")
        }

        setTimeout(function(){
            $("#my_action_container").attr("class","mx-5 col-6 border border-2 border-dark rounded-9 shadow")
            $("#opponent_action_container").attr("class","offset-1 col-6 border border-2 border-dark rounded-9 shadow")

            if (parseInt(status.my_score) > 3) {
                EndGame()
                window.location.href = "/result/win"
            } else if (parseInt(status.op_score) > 3) {
                EndGame()
                window.location.href = "/result/lose"
            } else {
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
            }
        },1500); 

    });

    $(".option").click(option_click)

})