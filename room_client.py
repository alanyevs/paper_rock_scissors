import uuid
import http.client
import json

GameID = str(uuid.uuid4())
# TODO: the player id should be fetched or passed in from somewhere?
PlayerID = 'c5a0a4cc-5f15-4218-8b4c-71f2768726ee'

# Constants Copied from AppSync API 'Settings'
API_URL = "https://pghvue5ynvgxhj2inkeou75hay.appsync-api.us-east-1.amazonaws.com/graphql"
API_KEY = "da2-afgsjsfxyregnltlv7frqf5wnq"

HOST = API_URL.replace('https://','').replace('/graphql','')
HEADERS = {
    'Content-type': 'application/graphql', 
    'x-api-key': API_KEY,
    'host': HOST
}

def connection():
    conn = http.client.HTTPSConnection(HOST, 443)
    return conn

def create_room(gameID, playerID, capacity = "2"):
    ''' triggered when a player create a room

    gameID: str
        the id of game that is going to create, this should be generated through uuid
    
    playerID: str
        the id of the player
    
    capacity: str
        the capacity of this new room, default is 2 and we only support 2 players so far
    '''
    conn = connection()
    status = "Preparing"
    graphql_mutation = {
        'query': 'mutation($in:CreateRoomInput!){createRoom(input:$in){GameID PlayerIDs Capacity Status}}',
        'variables': '{ "in": {"GameID":"'+ gameID +'", "PlayerIDs":"'+ playerID +'", "Capacity":"'+ capacity +'", "Status":"'+ status +'"} }'
    }
    mutation_data = json.dumps(graphql_mutation)

    # Now Perform the Mutation
    conn.request('POST', '/graphql', mutation_data, HEADERS)
    response = conn.getresponse()

    response_string = response.read().decode('utf-8')
    print("********************************************************************")
    print(response_string)

def list_rooms():
    ''' list all the rooms that are either still preparing or playing

    return: list of dict
        return a list of rooms
    '''
    conn = connection()
    graphql_query = {
        'query': 'query{ listRooms { items {GameID PlayerIDs Capacity Status} } }'
    }
    query_data = json.dumps(graphql_query)

    conn.request('POST', '/graphql', query_data, HEADERS)
    response = conn.getresponse()
    response = response.read().decode('utf-8')
    response = json.loads(response)
    
    rooms = response['data']['listRooms']['items']
    return rooms

def get_room_info(gameID):
    ''' get the detail info of a specific room

    gameID: id of the room

    return: dict
        return the detail info of the room
    '''
    rooms = list_rooms()
    for room in rooms:
        if room['GameID'] == gameID:
            return room

def join_room(gameID, playerID):
    ''' triggered when a player join the room

    gameID: str
        the id of game that the user is going to join
    
    playerID: str
        the id of player

    return: bool
        return true if the user join the game sucessfully, false otherwise
    '''
    conn = connection()
    rooms = list_rooms()

    for room in rooms:
        if room['GameID'] == gameID:
            playerIDs = room['PlayerIDs'] + ',' + playerID
            capacity = room['Capacity']
            status = room['Status']
            # the status could only be preparing
            assert(status == "Preparing")
    
            graphql_mutation = {
                'query': 'mutation($in:UpdateRoomInput!){updateRoom(input:$in){GameID PlayerIDs Capacity Status}}',
                'variables': '{ "in": {"GameID":"'+ gameID +'", "PlayerIDs":"'+ playerIDs +'", "Capacity":"'+ capacity +'", "Status":"'+ status +'"} }'
            }

            mutation_data = json.dumps(graphql_mutation)
            conn.request('POST', '/graphql', mutation_data, HEADERS)
            response = conn.getresponse()
            return True
    
    return False

def start_room(gameID):
    ''' triggered when a game is start playing
    '''
    conn = connection()
    rooms = list_rooms()

    for room in rooms:
        if room['GameID'] == gameID:
            playerIDs = room['PlayerIDs']
            capacity = room['Capacity']
            status = "Playing"
            graphql_mutation = {
                'query': 'mutation($in:UpdateRoomInput!){updateRoom(input:$in){GameID PlayerIDs Capacity Status}}',
                'variables': '{ "in": {"GameID":"'+ gameID +'", "PlayerIDs":"'+ playerIDs +'", "Capacity":"'+ capacity +'", "Status":"'+ status +'"} }'
            }
            mutation_data = json.dumps(graphql_mutation)
            conn.request('POST', '/graphql', mutation_data, HEADERS)
            response = conn.getresponse()
            return True
    
    return False

def exit_room(gameID, playerID, status = "Preparing"):
    ''' triggered when a player exit the room or delete the room

    status: str
        default value is Preparing, it would only remove the player from the room but not delete the room.
        but if the owner of the room wants to end the game, the status shold be "Deleting"
    
    return: bool
        return true if exit or delete the room sucessfully, false otherwise
    '''
    conn = connection()
    if status == 'Deleting':
        graphql_mutation = {
            'query': 'mutation($in:DeleteRoomInput!){deleteRoom(input:$in){GameID}}',
            'variables': '{ "in": {"GameID":"'+ gameID +'"} }'
        }

        mutation_data = json.dumps(graphql_mutation)

        # Now Perform the Mutation
        conn.request('POST', '/graphql', mutation_data, HEADERS)
        try:
            conn.getresponse()
        except:
            return False
        
        return True
    else:
        rooms = list_rooms()
        for room in rooms:
            if room['GameID'] == gameID:
                playerIDs = room['PlayerIDs']
                playerIDs = playerIDs.split(',')
                playerIDs.remove(playerID)
                if len(playerIDs) == 0:
                    return exit_room(gameID, "", "Deleting")
                playerIDs = ','.join(playerIDs)
                capacity = room['Capacity']
                status = room['Status']
                assert(status == 'Preparing')
                graphql_mutation = {
                    'query': 'mutation($in:UpdateRoomInput!){updateRoom(input:$in){GameID PlayerIDs Capacity Status}}',
                    'variables': '{ "in": {"GameID":"'+ gameID +'", "PlayerIDs":"'+ playerIDs +'", "Capacity":"'+ capacity +'", "Status":"'+ status +'"} }'
                }
                mutation_data = json.dumps(graphql_mutation)
                conn.request('POST', '/graphql', mutation_data, HEADERS)
                return True
        
        return False


