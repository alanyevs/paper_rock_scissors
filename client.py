import uuid
import http.client
import json


# GameID = str(uuid.uuid4())
# PlayerID = str(uuid.uuid4())
GameID = "abc"
PlayerID = 'c5a0a4cc-5f15-4218-8b4c-71f2768726ee'

# Constants Copied from AppSync API 'Settings'
API_URL = "https://pghvue5ynvgxhj2inkeou75hay.appsync-api.us-east-1.amazonaws.com/graphql"
API_KEY = "da2-afgsjsfxyregnltlv7frqf5wnq"

HOST = API_URL.replace('https://','').replace('/graphql','')

conn = http.client.HTTPSConnection(HOST, 443)
headers = {
    'Content-type': 'application/graphql', 
    'x-api-key': API_KEY,
    'host': HOST
}

new_action = "rock"
Round = str(1)

graphql_mutation = {
    'query': 'mutation($in:UpdateActionInput!){updateAction(input:$in){PlayerID GameID Round Action}}',
    'variables': '{ "in": {"PlayerID":"'+ PlayerID +'", "GameID":"'+ GameID +'", "Round":"'+ Round +'", "Action":"'+ new_action +'"} }'
}
mutation_data = json.dumps(graphql_mutation)

# Now Perform the Mutation
conn.request('POST', '/graphql', mutation_data, headers)
response = conn.getresponse()

response_string = response.read().decode('utf-8')
print(response_string)