function exit_room(records, won) {
    records = JSON.parse(records);
    GetProfile(UserID).then((response) => {
        let data = response.data
        if (won) {
            data.WinCount = (parseInt(data.WinCount) + 1).toString();
        }
        data.GameCount = (parseInt(data.GameCount) + 1).toString();
        data.GamePlayed.push(records);
        console.log(data);
        EditProfile(data).then((response) => {
            console.log("response is ", response);
            window.location.href = "/result/win"
        })
        .catch((error) => {
            console.log("error is ", error);
        });
    })
    .catch((error) => {
        console.log("error is ", error);
    });
    
}

function EndGame(result) {
    if (result == "win") {
        socket.emit("exit_room", {"Status": "Deleting"});
    }
}

function option_click(){
    $(".option").css("visibility","hidden")
    $(this).css("visibility","visible")
    $(".option").off('click')
    socket.emit("my_action",{"action": $(this).attr("op"), "round":round})
}

function EditProfile(data) {
    return sdk.profileEditPost({}, {user_id: UserID, profile_info: data}, {});
    // return sdk.profileEditPost(JSON.stringify({"user_id": UserID, "profile_info": data}));
}

$(document).ready(function(){
    socket.on('test', function(data) {
        console.log(data)
    })

    socket.on("win_the_game", function(records) {
        exit_room(records, true);
    })
    
    socket.on("lose_the_game", function(records) {
        exit_room(records, false);
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
                EndGame("win")
            } else if (parseInt(status.op_score) <= 3 && parseInt(status.my_score) <= 3) {
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