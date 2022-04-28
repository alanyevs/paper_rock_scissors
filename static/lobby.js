// https://us-east-1.console.aws.amazon.com/cognito/v2/idp/user-pools/us-east-1_7HmIlK58R/app-integration/clients/ie9nhbqo6337pllabr0q4nsmd?region=us-east-1
var clientID = "ie9nhbqo6337pllabr0q4nsmd";
var clientSecret = "hfsj7ksuf25lrnp0kst7ho9dd3vd2hscp8cvmnv5e2uv9c54rt6";

var cognito_url = "https://playerx.auth.us-east-1.amazoncognito.com/oauth2/token";

function getUser(code) {
    var request = new XMLHttpRequest();
    request.open("POST", cognito_url, true); 
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("grant_type=authorization_code&client_id="+clientID+"&"+"client_secret="+clientSecret+"&code="+code+"&redirect_uri="+"http://localhost:8000/template/lobby.html");
    request.onreadystatechange = function () {
        if (request.readyState == request.DONE) {
            var response = request.responseText;
            var obj = JSON.parse(response); 
            var id_token = obj.id_token; //store the value of the accesstoken
            var user_info = JSON.parse(atob(id_token.split('.')[1]));
            console.log(user_info);
            var user_id = user_info['sub'];
            // TODO: 应该还没写完
        }
    }
}

let data=[
    {
        "roomid": "1002386",
        "creator": "alanyevs",
        "people": "1/2",
        "game": "PSR"
    }
]

$(document).ready(function(){
    // Get query parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    // TODO: Load avatar
    getUser(code)
    .then((response) => {
        console.log(response);
    })
    .then ((error) => {
        console.log(error);
    });
    $.each(data, function(i, d){
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
        $("#lobby_container").append(r)
    })
})