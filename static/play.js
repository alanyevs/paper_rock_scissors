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

    $("#my_action_container").css("box-shadow","0 .5rem 1rem rgba(0,0,0,.15)")
    $("#opponent_action_container").css("box-shadow","0 .5rem 1rem rgba(0,0,0,.15)")

    socket.on('play_status', function(status) {
        console.log(status)
        
        $("#opponent_action_container").html(opponent_option_element)
        $("#opponent_option").attr("src",sucai_path+"/"+status.op_action+".svg")

        if (status.res == "win") {
            $("#my_action_container").css("box-shadow","0 .5rem 1.5rem rgba(44,204,27,0.7)")
            $("#opponent_action_container").css("box-shadow","0 .5rem 1.5rem rgba(227,40,11,0.7)")
        } else if (status.res == "lose") {
            $("#opponent_action_container").css("box-shadow","0 .5rem 1.5rem rgba(44,204,27,0.7)")
            $("#my_action_container").css("box-shadow","0 .5rem 1.5rem rgba(227,40,11,0.7)")
        } else if (status.res == "draw") {
            $("#opponent_action_container").css("box-shadow","0 .5rem 1.5rem rgba(245,145,5,0.7)")
            $("#my_action_container").css("box-shadow","0 .5rem 1.5rem rgba(245,145,5,0.7)")
        }

        setTimeout(function(){
            $("#opponent_action_container").css("box-shadow","0 .5rem 1rem rgba(0,0,0,.15)")
            $("#my_action_container").css("box-shadow","0 .5rem 1rem rgba(0,0,0,.15)")

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
    setTimeout(function(){
        $(".option").click(option_click)
    },400); 
})