from flask import Flask, render_template
import os

def setTemplateFolder():
	originalDir = os.getcwd()
	targetDir = os.path.abspath(os.path.join(originalDir, os.pardir)) + '/client/'
	return targetDir

folderRoute = setTemplateFolder()
app = Flask(__name__, template_folder=setTemplateFolder())

@app.route("/")
def runClient():
	return render_template("client.html", appRoute = folderRoute)

if __name__ == "__main__":
	app.debug = True
	app.run()