from flask import Flask, render_template, request, session
import os, loginManager, sessionFunctions, json
from gevent.wsgi import WSGIServer
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketServer, WebSocketApplication, Resource


app = Flask(__name__, static_url_path='/static',template_folder='static') 
app.secret_key = 'SWNGh6pY5LRy7zka82c5OUFyAkbxU5AwB2V5'
ConnectedUsers = []



@app.route("/", methods=['POST', 'GET'])
def runClient():
	return app.send_static_file('client.html')

# ----- Login routes -----

# Route for logging in, calls the signIn functions in the loginManager module.
@app.route("/sign-in", methods=["POST","GET"])
def signIn():
	if request.method == 'POST':
		email = request.form['email']
		password = request.form['password']
		response = loginManager.signIn(email,password)
		return response

	if request.environ.get('wsgi.websocket'):		
		ws = request.environ['wsgi.websocket']
		while True:			
			userToken = ws.receive()
			email = sessionFunctions.getSessionEmail(userToken)
			user_connection = {'email': email, 'conn': ws, 'token': userToken}
			global ConnectedUsers 
			logoutUserWebSocket(user_connection['email'])
			ConnectedUsers.append(user_connection)
			publishLiveData()		
	return logoutUserClick(user_connection['email'])

@app.route("/sign-up", methods=["POST"])
def signUp():
	email = request.form['email']
	password = request.form['password']
	repeatPassword = request.form['repeatPassword']
	firstname = request.form['firstname']
	familyname = request.form['familyname']
	gender = request.form['gender']
	city = request.form['city']
	country = request.form['country']
	response = loginManager.signUp(email, password, repeatPassword,firstname,familyname,gender,city,country)
	publishLiveData();
	return response

@app.route("/sign-out", methods=["POST"])
def signOut():
	token = request.form['token']
	email = request.form['email']
	response = loginManager.signOut(token)
	logoutUserClick(email)
	publishLiveData()
	return response


# ----- End of login routes -----

@app.route('/clear-session', methods=['POST', 'GET'])
def clearSesison():
	session.clear()
	return 'fuck you'

@app.route('/get-session', methods=['POST','GET'])
def getSession():
	print session
	return 'See terminal for sessoins'

# ----- Routes to be called once the user is logged in 'session functions' -----

@app.route("/change-password", methods=['POST'])
def changePassword():
	token = request.form['token']
	oldPassword = request.form['oldPassword']
	newPassword = request.form['newPassword']
	return sessionFunctions.changePassword(token,oldPassword,newPassword)

@app.route("/get-user-data-by-token", methods=['POST','GET'])
def getUserDataByToken():
	token = request.form['token']
	return sessionFunctions.getUserDataByToken(token)

@app.route("/get-user-data-by-email", methods=['POST','GET'])
def getUserDataByEmail():
	token = request.form['token']
	email = request.form['email']
	return sessionFunctions.getUserDataByEmail(token, email)

@app.route("/my-wall", methods=['POST'])
def getMyWall():
	token = request.form['token']
	return sessionFunctions.getUserMessagesByToken(token)
		
@app.route("/other-wall", methods=['POST'])
def getOtherWall():
	token = request.form['token']
	email = request.form['email']
	return sessionFunctions.getUserMessagesByEmail(token, email)


@app.route('/post-message', methods=['POST'])
def postMessage():
	token = request.form['token']
	email = request.form['email']
	message = request.form['message']
	response = sessionFunctions.postMessage(token, email, message)
	print('before publishLiveData')
	publishLiveData()
	return response


# ----- End of 'session functions' -----

# ----- Routes for refreshing the page -----

@app.route('/wall', methods=['GET','POST'])
def wall():
	return render_template('client.html')

@app.route('/profile', methods=['GET','POST'])
def profile():
	return render_template('client.html')

@app.route('/search', methods=['GET','POST'])
def search():
	return render_template('client.html')

@app.route('/about', methods=['GET','POST'])
def about():
	return render_template('client.html')




@app.route('/init-db', methods=['POST','GET'])
def initDatabase():
	confirmation = request.form['confirm']
	if confirmation == 'yes':
		return loginManager.startNewDatabase()
	else:
		return "don't do it man"

def checkSession(token):
	if token in session:
		print(session)
		return 'you are logged in'
	else:
		return 'not logged in'

def getUserToken():

	# Will be used to extract token from the users cookie
	token = 'not a token'

	return token

def publishLiveData():
	global ConnectedUsers
	print('in publish live data')
	liveData = sessionFunctions.getDataUpdate()
	liveData.update({'loggedIn': len(ConnectedUsers)})
	for user in ConnectedUsers:
		myMessages = sessionFunctions.numberOfMessagesOnMyWall(user['email'])
		myLiveData = dict(liveData, **myMessages)
		data = json.dumps({'type': 'live data', 'liveData': myLiveData})
		connection = user['conn']
		connection.send(data)

def logoutUserWebSocket(email):
	global ConnectedUsers
	for item in ConnectedUsers:	
		if (item['email'] == email):
			connection = item['conn']
			connection.send(item['token'])
			ConnectedUsers.remove(item)
	return ''

def logoutUserClick(email):
	global ConnectedUsers
	print ConnectedUsers
	for item in ConnectedUsers:
		if (item['email'] == email):
			ConnectedUsers.remove(item)
	print ConnectedUsers
	return ''


if __name__ == "__main__":
	http_server = WSGIServer(('',5000), app, handler_class=WebSocketHandler)
	http_server.serve_forever()
	#app.debug = True
