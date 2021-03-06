import uuid
import http.client
import json


# GameID = str(uuid.uuid4())
# PlayerID = str(uuid.uuid4())
GameID0 = "abcdef"
PlayerID0 = 'c5a0a4cc-5f15-4218-8b4c-71f2768726ee'
new_action = "rock"
Round0 = str(1)

# Constants Copied from AppSync API 'Settings'
API_URL = "https://pghvue5ynvgxhj2inkeou75hay.appsync-api.us-east-1.amazonaws.com/graphql"
API_KEY = "da2-afgsjsfxyregnltlv7frqf5wnq"

HOST = API_URL.replace('https://','').replace('/graphql','')

headers = {
            'Content-type': 'application/graphql', 
            'x-api-key': API_KEY,
            'host': HOST
        }

def connection():
    conn = http.client.HTTPSConnection(HOST, 443)
    return conn

class play_send_socket():
    def __init__(self):
        pass
        # self.conn = http.client.HTTPSConnection(HOST, 443)
        
    def send(self, playerid, gameid, round, action):
        conn = connection()
        graphql_mutation = {
            'query': 'mutation($in:UpdateActionInput!){updateAction(input:$in){PlayerID GameID Round Action}}',
            'variables': '{ "in": {"PlayerID":"'+ playerid +'", "GameID":"'+ gameid +'", "Round":"'+ round +'", "Action":"'+ action +'"} }'
        }
        mutation_data = json.dumps(graphql_mutation)
        # Now Perform the Mutation
        conn.request('POST', '/graphql', mutation_data, headers)
        response = conn.getresponse()

        response_string = response.read().decode('utf-8')

    def start(self, playerid, gameid):
        conn = connection()
        round = "0"
        action = "null"
        graphql_mutation = {
            'query': 'mutation($in:CreateActionInput!){createAction(input:$in){PlayerID GameID Round Action}}',
            'variables': '{ "in": {"PlayerID":"'+ playerid +'", "GameID":"'+ gameid +'", "Round":"'+ round +'", "Action":"'+ action +'"} }'
        }
        mutation_data = json.dumps(graphql_mutation)

        # Now Perform the Mutation
        conn.request('POST', '/graphql', mutation_data, headers)
        response = conn.getresponse()

        response_string = response.read().decode('utf-8')
    
    def delete(self, playerid):
        conn = connection()
        graphql_mutation = {
            'query': 'mutation($in:DeleteActionInput!){deleteAction(input:$in){PlayerID}}',
            'variables': '{ "in": {"PlayerID":"'+ playerid +'"} }'
        }
        mutation_data = json.dumps(graphql_mutation)

        # Now Perform the Mutation
        conn.request('POST', '/graphql', mutation_data, headers)
        try:
            conn.getresponse()
        except:
            return False
        
        return True


if __name__ == "__main__":
    x = play_send_socket()
    x.send(PlayerID0,GameID0,Round0,new_action)