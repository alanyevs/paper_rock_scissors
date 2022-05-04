let logo_path = "https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
//let ava = "https://m.media-amazon.com/images/I/816p9XkbMQL._SL1427_.jpg"
// let avatar_path = "static/sucai/avatars/IMG_1.jpg"
// let PlayerIDs = null

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