let temp = {
    //"avatar": "https://m.media-amazon.com/images/I/816p9XkbMQL._SL1427_.jpg",
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

function SubmitChange(id, ava){
    // TODO: submit the id to aws db
    console.log(id)
}

function EditProfile(){
    $(this).html("Confirm")
    $("#user_id").attr("contentEditable", true)
    $(this).click(ConfirmProfile)
}

function ConfirmProfile(){
    $(this).html("Edit")
    $("#user_id").attr("contentEditable", false)
    SubmitChange($("#user_id").html(),0)
    $(this).click(EditProfile)
}

$(document).ready(function(){
    $("#edit_btn").click(EditProfile)



    console.log(UserID);
    GetProfile(UserID)
    .then((response) => {
        console.log(response);
        let data = response.data;
        $("#user_id").html(data.UserName)
        $("#user_avatar").attr("src", GetAvatarPath(data.AvatarIndex)) // TODO: 头像
        $("#win_count").html(data.WinCount)
        $("#game_count").html(data.GameCount)
        $("#level").html(temp.level)  // ???? TODO: 等级
        $("#p_wr").html(temp.paper_rate)  // TODO: 算概率
        $("#r_wr").html(temp.rock_rate)
        $("#s_wr").html(temp.scissors_rate)
    })
    .catch((error) => {
        console.log(error);
    });
    $.each(temp.recent_games, function(i, d){
        let r = $("<div class='row'>")
        let c = $("<div class='col-1'>")
        c.html(d.roomid)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.creator)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.people)
        r.append(c)
        c = $("<div class='col-2'>")
        c.html(d.game)
        r.append(c)
        $("#recent_container").append(r)
    })

})