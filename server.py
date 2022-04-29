from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask_socketio import SocketIO, emit
from threading import Lock
app = Flask(__name__)

async_mode = None
socketio = SocketIO(app, async_mode=None)
thread = None
thread_lock = Lock()

def play_event_listener():
    # fetch data
    while True:
        socketio.sleep(3)
        a = input("input status:")
        op, me, op_s, me_s = a.split()
        #fectch data and compute

        data = {"opponent":op,"me":me,"opponent_score":op_s,"my_score":me_s}
        socketio.emit('play_status', data)
        # update_play_status(data)

def play_event_updater(json):
    print('received json: ' + str(json))
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
def handle_my_action(json):
    play_event_updater(json)

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
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(play_event_listener)


if __name__ == '__main__':
   socketio.run(app)
