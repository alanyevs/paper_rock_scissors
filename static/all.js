let logo_path = "static/sucai/logo.png"

function GetAvatarPath(AvatarIndex) {
    return "static/sucai/avatars/IMG_"+ AvatarIndex +".jpg";
}

function GetProfile(UserID) {
    return sdk.profileGet({"UserID": UserID});
}

$(document).ready(function(){
    $("#logo").attr("src", logo_path)
    GetProfile(UserID)
    .then((response) => {
        let data = response.data;
        console.log(GetAvatarPath(data.AvatarIndex));
        $("#avatar").attr("src", GetAvatarPath(data.AvatarIndex))
    })
    .catch((error) => {
        console.log(error);
    });
})