from flask import Flask, render_template, request, session
import os, loginManager, sessionFunctions

def setTemplateFolder():
	originalDir = os.getcwd()
	targetDir = os.path.abspath(os.path.join(originalDir, os.pardir)) + '/client/'
	return targetDir

folderRoute = setTemplateFolder()
app = Flask(__name__) #, template_folder=setTemplateFolder()
app.secret_key = 'SWNGh6pY5LRy7zka82c5OUFyAkbxU5AwB2V5'


@app.route("/")
def runClient():
	return loginManager.getDatabaseDirectory()

@app.route("/test/<name>")
def testInput(name):
	if (name == "byEmail"):
		return sessionFunctions.getUserDataByEmail(name,name)
	elif (name == "byToken"):
		return sessionFunctions.getUserDataByToken(name)
	else:
		return "Your name is " + name

# ----- Login routes -----

# Route for logging in, calls the signIn functions in the loginManager module.
@app.route("/sign-in", methods=["POST"])
def signIn():
	email = request.form['email']
	password = request.form['password']
	return loginManager.signIn(email,password)

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
	return loginManager.signUp(email, password, repeatPassword,firstname,familyname,gender,city,country)['message']

@app.route("/sign-out", methods=["POST"])
def signOut():
	token = request.form['token']
	return loginManager.signOut(token)['message']

# ----- End of login routes -----

@app.route('/clear-session', methods=['POST', 'GET'])
def clearSesison():
	return session.clear()

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
	return sessionFunctions.postMessage(token, email, message)

# ----- End of 'session functions' -----


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

if __name__ == "__main__":
	app.debug = True
	app.run()