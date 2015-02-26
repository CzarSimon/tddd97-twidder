import random
import databaseStub as db
from session import session

# --------- Public functions ---------

# Checkes that the entered email is registred and that the password corresponds to the registred one.
# If successfull: logges in the user and assigns it a random token.
# If unsucessfull: Fails to log in.
# Parameters: 'email' (type: string), 'password' (type: string)
# Returns: Dictionary consisting of 'success' (type: boolean), 'message' (type: string), 'data' (type: session class object)
def signIn(email, password):
	if ((email in db.dummyUsers.keys()) and (password == db.dummyUsers[email]['password'])):
		token = __setToken()
		newSession = session(token, email)
		return {'success': True, 'message': 'Successfully signed in.', 'data': newSession}
	else:
		return {'success': False, 'message': 'Wrong username or password.'}


def signUp(email, password, firstname, familyname, gender, city, country):
	print(email)
	return "signed up as " + db.dummyUsers[email]['email']


# Checks if the user is logged in and signs them out if true.
# Parameters: 'token' (type: string)
# Returns: Dictionary consitsting of 'success' (type: boolean), 'message': (type: string)
def signOut(token):
	token = db.getMyToken()
	if (token in db.loggedInDummyUsers.keys()):
		# Remove the users form the logged in table in the database
		return {"success": True, "message": "Successfully signed out."}
	else:
		return {"success": False, "message": "You are not signed in."}

# --------- End of public functions ---------



# --------- Private functions ---------

# Creates and returns a 36 characters long random.
# Parameters: None
# Returns: 'token' (type: String)
def __setToken():
	letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	token = "";
	for i in range(0, 36):
		token += random.choice(letters)
	return token

# --------- End of private functions ---------