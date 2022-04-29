from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
from flask_socketio import SocketIO, emit
from listener import play_socket
from threading import Lock
from room import *
import json

app = Flask(__name__)

async_mode = None
socketio = SocketIO(app, async_mode=None)
thread = None
thread_lock = Lock()


def play_event_listener():
    def data_emitter(message):
        socketio.emit("test",message)
        op = message["payload"]["data"]["onUpdateAction"]["Action"]
        socketio.emit('play_status', {"opponent":op,"me":"waiting","opponent_score":"1","my_score":"2"})
    socket = play_socket('c5a0a4cc-5f15-4218-8b4c-71f2768726ee', data_emitter)
    socket.start()

def play_event_updater(data):
    print('received json: ' + str(data))
    pass

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
    play_event_updater(data)

@app.route('/result')
def game_result():
   return render_template('result.html')

@app.route('/lobby')
def lobby():
   return render_template('lobby.html')

@app.route('/create')
def create_game():
   return render_template('create.html')

@app.route('/leaderboard')
def leaderboard():
   return render_template('leaderboard.html')

@app.route('/profile')
def profile():
   return render_template('profile.html')

@app.route('/friend')
def friend():
   return render_template('friend.html')

######################### helper functions of lobby #########################
@socketio.on('create_room')
def create(data):
   playerID = data['PlayerID']
   capacity = data['Capacity']
   gameID = str(uuid.uuid4())
   create_room(gameID, playerID, capacity)

@socketio.on("list_rooms")
def list(data):
   rooms = list_rooms()
   socketio.emit("list_rooms_results", json.dumps(rooms))

@socketio.event
def connect():
    global thread 
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=play_event_listener)


if __name__ == '__main__':
   socketio.run(app)
