from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask_socketio import SocketIO, emit
from listener import play_listen_socket
from client import play_send_socket
from threading import Lock, Thread

app = Flask(__name__)

async_mode = None
socketio = SocketIO(app ,async_mode="threading")
op_thread = None
op_thread_lock = Lock()
my_thread = None
my_thread_lock = Lock()

status_lock = Lock()
current_game_status = {str(k):dict() for k in range(1,10)}


op_id = "c5a0a4cc-5f15-4218-8b4c-71f2768726ee"
my_id = "17f2cb34-97a4-42d8-85f4-4de55c34b74f"
game_id = "abcdef"


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


def action_listener(op_id):
    def store_action(message):
        global current_game_status
        # global status_lock
        # socketio.emit("test",message)
        action = message["payload"]["data"]["onUpdateAction"]["Action"]
        round = message["payload"]["data"]["onUpdateAction"]["Round"]
        # with status_lock:
        current_game_status[round]["opponent"] = action

        print("listener: ", current_game_status)

        if len(current_game_status[round]) == 2:
            # with status_lock:
            socketio.emit('play_status', compute_game_status(current_game_status, round))

    socket = play_listen_socket(op_id, store_action)
    socket.start()

# ROUTES

@app.route('/')
def start_page():
   return render_template('login.html')

@app.route('/login')
def login_page():
   return render_template('login.html')

@app.route('/play')
def play():
   return render_template('play.html')

@socketio.on('my_action')
def handle_my_action(data):
    print(data)
    # with status_lock:
    global current_game_status
    current_game_status[data["round"]]["me"] = data["action"]
    send_play.send(my_id, game_id, data["round"], data["action"])

    print("sender: ", current_game_status)
    if len(current_game_status[data["round"]]) == 2:
        # with status_lock:
        socketio.emit('play_status', compute_game_status(current_game_status, data["round"]))

@app.route('/result')
def game_result():
   return render_template('result.html')

@app.route('/lobby')
def lobby():
   return render_template('lobby.html')

@app.route('/create')
def create_game():
   return render_template('leaderboard.html')

@app.route('/leaderboard')
def leaderboard():
   return render_template('leaderboard.html')

@app.route('/profile')
def profile():
   return render_template('profile.html')

@app.route('/friend')
def friend():
   return render_template('friend.html')

@socketio.event
def connect():
    global op_id
    # global my_id

    global op_thread 
    with op_thread_lock:
        if op_thread is None:
            op_thread = socketio.start_background_task(target=action_listener, op_id=op_id)

    # print("##########T2")

    # global my_thread 
    # with my_thread_lock:
    #     # if my_thread is None:
    #     #     my_thread = socketio.start_background_task(target=action_listener, id=my_id, user="me")
    #     my_thread = Thread(action_listener, (my_id, "me"))
    #     my_thread.start()


if __name__ == '__main__':
   socketio.run(app)
