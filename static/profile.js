let temp = {
    "avatar": "static/sucai/avatars/IMG_3.jpg",
    "user_id": "alanyevs",
    "winning_rate": "20%",
    "games": "200",
    "level":"17",
    "paper_rate": "30%",
    "scissors_rate": "30%",
    "rock_rate": "40%",
    "recent_games": []
}

function GetAvatarPath(AvatarIndex) {
    return "static/sucai/avatars/IMG_"+ AvatarIndex +".jpg";
}

function GetProfile(UserID) {
    return sdk.profileGet({"UserID": UserID});
}

function SubmitChange(NewUserName, NewAvatarIndex){
    GetProfile(UserID).then((response) => {
        let data = response.data
        data.UserName = NewUserName;
        data.AvatarIndex = NewAvatarIndex;
        console.log(data);
        sdk.profileEditPost({}, {user_id: UserID, profile_info: data}, {}).then((response) => {
            console.log("response is ", response);
        })
        .catch((error) => {
            console.log("error is ", error);
        });
    })
    .catch((error) => {
        console.log("error is ", error);
    });
}

function EditProfile(){
    $(this).html("Confirm")
    $("#user_id").attr("contentEditable", true)
    $('#user_avatar').click(ChangeAvatar)
    $('#user_avatar').css('cursor', 'pointer');
    $(this).click(ConfirmProfile)
}

function ConfirmProfile(){
    $(this).html("Edit")
    $("#user_id").attr("contentEditable", false)
    $('#user_avatar').css('cursor', 'default')
    $('#user_avatar').off('click')
    SubmitChange($("#user_id").html(), anum)
    $(this).click(EditProfile)
}

function ChangeAvatar(){
    anum = (Math.floor(Math.random() * 9)+1).toString()
    $('#user_avatar').attr("src",GetAvatarPath(anum))
}

let anum = 0;

$(document).ready(function(){
    $("#edit_btn").click(EditProfile)
    $('#user_avatar').off('click')
    $('#user_avatar').css('cursor', 'default')
    
    console.log(UserID);
    GetProfile(UserID)
    .then((response) => {
        console.log(response);
        let data = response.data;
        $("#user_id").html(data.UserName)
        $("#user_avatar").attr("src", GetAvatarPath(data.AvatarIndex))
        anum = data.AvatarIndex
        $("#win_count").html(data.WinCount)
        $("#game_count").html(data.GamesCount)

        let s = parseInt(data.NumOfPaper) + parseInt(data.NumOfRock) + parseInt(data.NumOfScissor)

        if (s > 0) {
            $("#p_wr").html((Math.round(parseInt(data.NumOfPaper)*100/s)).toString())
            $("#r_wr").html((Math.round(parseInt(data.NumOfRock)*100/s)).toString()) 
            $("#s_wr").html((Math.round(parseInt(data.NumOfScissor)*100/s)).toString()) 
        } else {
            $("#p_wr").html('0')
            $("#r_wr").html('0')
            $("#s_wr").html('0')
        }

        

        $.each(data.GamesPlayed, function(i, d){
            GetProfile(d[0])
            .then((response) => {
                let r = $("<div class='row'>")
                let c = $("<div class='col-1'>")
                c.html(d.roomid)
                r.append(c)
                c = $("<div class='col-2'>")
                c.html('Paper-Rock-Scissor')
                r.append(c)
                c = $("<div class='col-2'>")
                c.html(response.data.UserName)
                r.append(c)
                c = $("<div class='col-2'>")
                c.html(d[1])
                r.append(c)
                c = $("<div class='col-2'>")
                c.html(d[2])
                r.append(c)
                $("#recent_container").append(r)
            })
            .catch((error) => {
                console.log(error);
            })
        })
    })
    .catch((error) => {
        console.log(error);
    });

})