from flask import Flask, render_template, request
import os, loginManager, sessionFunctions

def setTemplateFolder():
	originalDir = os.getcwd()
	targetDir = os.path.abspath(os.path.join(originalDir, os.pardir)) + '/client/'
	return targetDir

folderRoute = setTemplateFolder()
app = Flask(__name__) #, template_folder=setTemplateFolder()

@app.route("/")
def runClient():
	return loginManager.test()

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
	return loginManager.signIn(email,password)

@app.route("/sign-up", methods=["POST"])
def signUp():
	test = request.form['email']
	return loginManager.signUp(test,'test','test','test','test','test','test')

@app.route("/sign-out", methods=["POST"])
def signOut():
	return loginManager.signOut('test')

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



if __name__ == "__main__":
	app.debug = True
	app.run()