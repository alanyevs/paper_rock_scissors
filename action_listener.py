from base64 import b64encode, decode
from concurrent.futures import thread
from datetime import datetime
from uuid import uuid4
import websocket
import threading
import json


# Constants Copied from AppSync API 'Settings'
API_URL = "https://pghvue5ynvgxhj2inkeou75hay.appsync-api.us-east-1.amazonaws.com/graphql"
API_KEY = "da2-afgsjsfxyregnltlv7frqf5wnq"

# GraphQL subscription Registration object
GQL_SUBSCRIPTION = json.dumps({
        'query': 'subscription OnUpdateAction { onUpdateAction { __typename GameID PlayerID Round Action } }',
        'variables': {}
})

# Discovered values from the AppSync endpoint (API_URL)
WSS_URL = API_URL.replace('https','wss').replace('appsync-api','appsync-realtime-api')
HOST = API_URL.replace('https://','').replace('/graphql','')

# Subscription PlayerID
PlayerID = 'c5a0a4cc-5f15-4218-8b4c-71f2768726ee'

# Set up Timeout Globals
timeout_timer = None
timeout_interval = 10

# Calculate UTC time in ISO format (AWS Friendly): YYYY-MM-DDTHH:mm:ssZ
def header_time():
    return datetime.utcnow().isoformat(sep='T',timespec='seconds') + 'Z'

# Encode Using Base 64
def header_encode( header_obj ):
    return b64encode(json.dumps(header_obj).encode('utf-8')).decode('utf-8')

# reset the keep alive timeout daemon thread
def reset_timer( ws ):
    global timeout_timer
    global timeout_interval

    if (timeout_timer):
        timeout_timer.cancel()
    timeout_timer = threading.Timer( timeout_interval, lambda: ws.close() )
    timeout_timer.daemon = True
    timeout_timer.start()

# Create API key oentication header
api_header = {
    'host':HOST,
    'x-api-key':API_KEY
}


def on_message_id(id, emit_func):
    # Socket Event Callbacks, used in WebSocketApp Constructor
    def on_message(ws, message):
        global timeout_timer
        global timeout_interval

        message_object = json.loads(message)
        message_type   = message_object['type']
        print("************************************************************************************")
        print("action socket received message: ", message)
        print("the type of message is ", message_type)
        if( message_type == 'ka' ):
            reset_timer(ws)

        elif( message_type == 'connection_ack' ):
            timeout_interval = int(json.dumps(message_object['payload']['connectionTimeoutMs']))

            register = {
                'id': id,
                'payload': {
                    'data': GQL_SUBSCRIPTION,
                    'extensions': {
                        'authorization': {
                            'host':HOST,
                            'x-api-key':API_KEY
                        }
                    }
                },
                'type': 'start'
            }
            start_sub = json.dumps(register)
            # print('>> '+ start_sub )
            ws.send(start_sub)

        elif(message_type == 'data'):
            emit_func(message_object)

        elif(message_object['type'] == 'error'):
            print ('Error from AppSync: ' + message_object['payload'])
    return on_message
    
def on_error(ws, error):
    print('### error ###')
    print(error)

def on_close(ws,*kargs):
    print('### closed ###')

def on_open(ws):
    print('### opened ###')
    init = {
        'type': 'connection_init'
    }
    init_conn = json.dumps(init)
    # print('>> '+ init_conn)
    ws.send(init_conn)


# Uncomment to see socket bytestreams
websocket.enableTrace(True)

# Set up the connection URL, which includes the Authentication Header
#   and a payload of '{}'.  All info is base 64 encoded
connection_url = WSS_URL + '?header=' + header_encode(api_header) + '&payload=e30='

# Create the websocket connection to AppSync's real-time endpoint
#  also defines callback functions for websocket events
#  NOTE: The connection requires a subprotocol 'graphql-ws'

class play_listen_socket():
    def __init__(self, id, f):
        self.ws = websocket.WebSocketApp( connection_url,
                            subprotocols=['graphql-ws'],
                            on_open = on_open,
                            on_message = on_message_id(id,f),
                            on_error = on_error,
                            on_close = on_close,)

    def start(self):
        self.ws.run_forever()


if __name__ == '__main__':

    def f(x):
        pass

    ws = websocket.WebSocketApp( connection_url,
                            subprotocols=['graphql-ws'],
                            on_open = on_open,
                            on_message = on_message_id(PlayerID,f),
                            on_error = on_error,
                            on_close = on_close,)

    ws.run_forever()