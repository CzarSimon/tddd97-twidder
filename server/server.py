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


@app.route("/sign-in", methods=["POST"])
def signIn():
	email = request.form['email']
	password = request.form['password']
	response = loginManager.signIn(email,password)
	if response['success']:
		return response['message'] + ' ' + checkSession(response['data'])
	else:
		return response['message']


@app.route("/sign-up", methods=["POST"])
def signUp():
	email = request.form['email']
	password = request.form['password']
	repeatPassword = request.form['repeatPassword']
	return loginManager.signUp(email, password, repeatPassword,'test','test','test','test','test')['message']

@app.route("/sign-out", methods=["POST"])
def signOut():
	token = getUserToken()
	return loginManager.signOut(token)['message']

@app.route("/change-password", methods=['POST'])
def changePassword():
	token = request.form['token']
	oldPassword = request.form['oldPassword']
	newPassword = request.form['newPassword']
	return sessionFunctions.changePassword(token,oldPassword,newPassword)

@app.route("/wall", methods=['POST'])
def getWall():
	token = request.form['token']
	email = request.form['email']
	if not email:
		return sessionFunctions.getUserMessagesByToken(token)
	else:
		return sessionFunctions.getUserMessagesByEmail(token, email)

@app.route('/post-message', methods=['POST'])
def postMessage():
	token = request.form['token']
	email = request.form['email']
	message = request.form['message']
	return sessionFunctions.postMessage(token, email, message)

@app.route('/init-db', methods=['POST','GET'])
def initDatabase():
	return loginManager.startNewDatabase()


def checkSession(token):
	if token in session:
		print(session)
		return 'you are logged in'
	else:
		return 'not logged in'

def getUserToken():

	# Will be used to extract token from the users cookie
	token = loginManager.tempSendToken()

	return token

if __name__ == "__main__":
	app.debug = True
	app.run()