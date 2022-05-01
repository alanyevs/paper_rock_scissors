from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
from flask_socketio import SocketIO, emit
from room_client import *
import json
from action_listener import play_listen_socket
from action_client import play_send_socket
from threading import Lock, Thread
from flask_awscognito import AWSCognitoAuthentication
import jwt
import uuid

from room_listener import room_socket

app = Flask(__name__)

app.config['AWS_DEFAULT_REGION'] = 'us-east-1'
app.config['AWS_COGNITO_DOMAIN'] = 'https://playerx.auth.us-east-1.amazoncognito.com'
app.config['AWS_COGNITO_USER_POOL_ID'] = 'us-east-1_7HmIlK58R'
app.config['AWS_COGNITO_USER_POOL_CLIENT_ID'] = 'ie9nhbqo6337pllabr0q4nsmd'
app.config['AWS_COGNITO_USER_POOL_CLIENT_SECRET'] = 'hfsj7ksuf25lrnp0kst7ho9dd3vd2hscp8cvmnv5e2uv9c54rt6'
app.config['AWS_COGNITO_REDIRECT_URL'] = 'http://localhost:8888/lobby'

aws_auth = AWSCognitoAuthentication(app)

async_mode = None
socketio = SocketIO(app ,async_mode="threading")
op_thread = None
room_thread = None
op_thread_lock = Lock()

my_thread = None
my_thread_lock = Lock()

status_lock = Lock()
current_game_status = {str(k):dict() for k in range(1,10)}

# TODO: these are global variables that should be updated promptly
op_id = "c5a0a4cc-5f15-4218-8b4c-71f2768726ee"
my_id = "17f2cb34-97a4-42d8-85f4-4de55c34b74f"
my_name = None
game_id = "1831723c-2d26-4e77-a57e-458ab5b553f6"

send_play = play_send_socket()


def compute_game_status(status, round):
    psr_rule = {'paper':'scissors','scissors':'rock','rock':'paper'}
    my_score = 0
    op_score = 0
    for i in range(1, int(round)+1):
        x = status[str(i)]
        if x["opponent"] != x["me"]:
            if psr_rule[x["opponent"]] == x["me"]:
                my_score += 1
            else:
                op_score += 1

    res = ''
    x = status[round]
    if x["opponent"] != x["me"]:
        res = "draw"
        if psr_rule[x["opponent"]] == x["me"]:
            res="win"
        else:
            res="lose"
    
    return {"my_score":str(my_score), "op_score":str(op_score), "round":str(int(round)+1), "res":res, "op_action":x["opponent"]}


def action_listener(op_id, my_id):
    def store_action(message):
        if message["payload"]["data"]["onUpdateAction"]["GameID"] != game_id:
            return
        global current_game_status
        action = message["payload"]["data"]["onUpdateAction"]["Action"]
        round = message["payload"]["data"]["onUpdateAction"]["Round"]
        if message["payload"]["data"]["onUpdateAction"]["PlayerID"] == op_id:
            player = "opponent" 
        elif message["payload"]["data"]["onUpdateAction"]["PlayerID"] == my_id:
            player = "me"
        else:
            return

        current_game_status[round][player] = action

        print("listener: ", current_game_status)

        if len(current_game_status[round]) == 2:
            socketio.emit('play_status', compute_game_status(current_game_status, round))

    register_id = str(uuid.uuid4())
    socket = play_listen_socket(register_id, store_action)
    socket.start()

def room_listener():
    def update_room(message):
        print("************************************************************************")
        print("new guy's comming in: ", message)
        if message["payload"]["data"]["onUpdateRoom"]["GameID"] != game_id:
            return
        socketio.emit("refresh_room", {})
    
    register_id = str(uuid.uuid4())
    socket = room_socket(register_id, update_room)
    socket.start()

# ROUTES

@app.route('/')
def start_page():
   return render_template('home.html')

@app.route('/login')
def login_page():
   return redirect(aws_auth.get_sign_in_url())

@app.route('/play')
def play():
   return render_template('play.html')

@socketio.on('my_action')
def handle_my_action(data):
    # print("")
    send_play.send(my_id, game_id, data["round"], data["action"])

@app.route('/result')
def game_result():
    return render_template('result.html')

@app.route('/lobby')
def lobby():
    if request.args:  # User log in
        access_token = aws_auth.get_access_token(request.args)
        decoded = jwt.decode(access_token, options={"verify_signature": False})
        global my_id
        global my_name
        my_id = decoded['sub']
        my_name = decoded['username']
        print(my_id)
    return render_template('lobby.html', user_id = my_id)

@app.route('/create')
def create_game():
   return render_template('create.html', user_id = my_id)

@app.route('/leaderboard')
def leaderboard():
   return render_template('leaderboard.html')

@app.route('/profile')
def profile():
   return render_template('profile.html', user_id = my_id)

@app.route('/friend')
def friend():
   return render_template('friend.html')

@app.route('/room')
def room():
    return render_template('room.html', user_id = my_id, game_id = game_id)

######################### helper functions of lobby #########################
@socketio.on('create_room')
def create(data):
    global game_id
    playerID = data['PlayerID']
    capacity = data['Capacity']
    gameID = str(uuid.uuid4())
    game_id = gameID
    create_room(gameID, playerID, capacity)
    socketio.emit("room_created", "")

@socketio.on("list_rooms")
def list(data):
   rooms = list_rooms()
   socketio.emit("list_rooms_results", json.dumps(rooms))

@socketio.on("join_room")
def join(data):
    playerID = data['PlayerID']
    gameID = data['GameID']
    print("************************************************************************")
    print(f"{playerID} is trying to join {gameID}")
    join_room(gameID, playerID)
    socketio.emit("join_room_success", '')

@socketio.on("get_room")
def get(data):
    gameID = data['GameID']
    room = get_room_info(gameID)
    socketio.emit("get_room_result", json.dumps(room))

@socketio.on("update_room")
def update(data):
    global game_id
    status = data['Status']
    if status == "Playing":
        start_room(game_id)
        socketio.emit("start_game_success", '')

@socketio.on("exit_room")
def exit(data):
    global game_id
    global my_id
    status = data['Status']
    if status == 'Preparing':
        exit_room(game_id, my_id)
        game_id = None
        socketio.emit("exit_room_success", '')
    elif status == "Deleting":
        pass

@socketio.on("update_gameid")
def update_gameid(data):
    global game_id
    gameID = data['GameID']
    game_id = gameID

@socketio.event
def connect():
    global op_id
    global my_id

    global op_thread
    global room_thread
    with op_thread_lock:
        if op_thread is None:
            op_thread = socketio.start_background_task(target=action_listener, op_id=op_id, my_id=my_id)
            # room_thread = socketio.start_background_task(target=room_listener, game_id = game_id)
            # op_thread = socketio.start_background_task(target=action_listener)
            room_thread = socketio.start_background_task(target=room_listener)

if __name__ == '__main__':
   socketio.run(app, host='localhost', port=8888)
