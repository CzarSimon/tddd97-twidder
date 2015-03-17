from flask import Flask, render_template, request, session
import os, loginManager, sessionFunctions, json
from gevent.wsgi import WSGIServer
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketServer, WebSocketApplication, Resource

# Starts the Flask application and specifies where the template and static folders are
app = Flask(__name__, static_url_path='/static',template_folder='static') 
app.secret_key = 'SWNGh6pY5LRy7zka82c5OUFyAkbxU5AwB2V5'

# Global list of all the connected users currently logged into the system
ConnectedUsers = []


# Route for the main loginpage of the application
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
			if logoutUserWebSocket(user_connection):
				ConnectedUsers.append(user_connection)
			print ConnectedUsers
			publishLiveData()
	return ''

# Route for the sign up function
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

# Route for the sign out function
@app.route("/sign-out", methods=["POST"])
def signOut():
	token = request.form['token']
	email = request.form['email']
	response = loginManager.signOut(token)
	logoutUserClick(email)
	publishLiveData()
	return response

# ----- Routes to be called once the user is logged in 'session functions' -----

# Route for chaning the password
@app.route("/change-password", methods=['POST'])
def changePassword():
	token = request.form['token']
	oldPassword = request.form['oldPassword']
	newPassword = request.form['newPassword']
	return sessionFunctions.changePassword(token,oldPassword,newPassword)


# Route for getting the user data with a supplied token
@app.route("/get-user-data-by-token", methods=['POST','GET'])
def getUserDataByToken():
	token = request.form['token']
	return sessionFunctions.getUserDataByToken(token)

# Route for getting the user data with a supplied email (and token)
@app.route("/get-user-data-by-email", methods=['POST','GET'])
def getUserDataByEmail():
	token = request.form['token']
	email = request.form['email']
	return sessionFunctions.getUserDataByEmail(token, email)

# Route for displaying the logged in users wall
@app.route("/my-wall", methods=['POST'])
def getMyWall():
	token = request.form['token']
	return sessionFunctions.getUserMessagesByToken(token)

# Route for displaying a diffrent users wall		
@app.route("/other-wall", methods=['POST'])
def getOtherWall():
	token = request.form['token']
	email = request.form['email']
	return sessionFunctions.getUserMessagesByEmail(token, email)

# Route for posting a message to a users wall
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

# Route for returning to the Wall page when refresh is used
@app.route('/wall', methods=['GET','POST'])
def wall():
	return render_template('client.html')

# Route for returning the the profile page when refresh is used
@app.route('/profile', methods=['GET','POST'])
def profile():
	return render_template('client.html')

# Route for returning to the search page when refresh is used
@app.route('/search', methods=['GET','POST'])
def search():
	return render_template('client.html')

# Route for returning to the about page when refresh is used
@app.route('/about', methods=['GET','POST'])
def about():
	return render_template('client.html')


# Route for initializing the database
@app.route('/init-db', methods=['POST','GET'])
def initDatabase():
	confirmation = request.form['confirm']
	if confirmation == 'yes':
		return loginManager.startNewDatabase()
	else:
		return "don't do it man"

# Retrives data to be pushed to all logged in users and subsequently sends it to all logged in users.
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

# Function that iterates through the ConnectedUsers list
# and removes the uses that is currently trying to log in
# This will log out the user if he is logged in in another
# webbrowser through the use of websockets
def logoutUserWebSocket(newConnection):
	global ConnectedUsers
	for item in ConnectedUsers:	
		if (item['email'] == newConnection['email']):
			if ((newConnection['conn'] != item['conn']) and (newConnection['token'] == item['token'])):
				item['conn'] = newConnection['conn']
				return False
			else:
				sender = item['conn']
				sender.send(item['token'])
				ConnectedUsers.remove(item)
	return True

# Removes a user from the ConnectedUsers list
# when the user logs out
def logoutUserClick(email):
	global ConnectedUsers
	for item in ConnectedUsers:
		if (item['email'] == email):
			ConnectedUsers.remove(item)
	return ''


# Initializes the Gevent server
if __name__ == "__main__":
	http_server = WSGIServer(('',5000), app, handler_class=WebSocketHandler)
	http_server.serve_forever()
	#app.debug = True
