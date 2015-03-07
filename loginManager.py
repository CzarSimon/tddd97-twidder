from flask import session
import random, re, json
import databaseStub as db, database_helper as database
# --------- Public functions ---------

# Checkes that the entered email is registred and that the password corresponds to the registred one.
# If successfull: logges in the user and assigns it a random token.
# If unsucessfull: Fails to log in.
# Parameters: 'email' (type: string), 'password' (type: string)
# Returns: Dictionary consisting of 'success' (type: boolean), 'message' (type: string), 'data' (type: string)
def signIn(email, password):
	if database.sign_in(email, password): # Validates the log in info in the database
		token = __setToken() 
		session[token] = email 		
		return json.dumps({'success': True, 'message': 'Successfully signed in.', 'data': token})
	else:
		return json.dumps({'success': False, 'message': 'Wrong username or password.'})

"""
Checks that the user info given is valid. If it is the function adds
the info to the database and calls the signIn function. If the information
is not vaild the function returns an error message.
Parameters: 'email', 'password', 'repeatPassword', 'firstname', 'familyname', 'gender', 'city', 'country' (type: string)
Returns: Dictionary consisting of 'success' (type: boolean), 'message' (type: string)
"""
def signUp(email, password, repeatPassword, firstname, familyname, gender, city, country):
	validInfo = __signUpValidation(email, password, repeatPassword)
	if validInfo['success']:
		# Adds the user info to the database.
		database.sign_up(email, password, firstname, familyname, gender, city, country) 
		# Logs in the user
		signIn(email, password)
	return validInfo

# Checks if the user is logged in and signs them out if true.
# Parameters: 'token' (type: string)
# Returns: Dictionary consitsting of 'success' (type: boolean), 'message': (type: string)
def signOut(token):
	if token in session:
		session.pop(token) # Removes the logged in users session.
		return {"success": True, "message": "Successfully signed out."}
	else:
		return {"success": False, "message": "You are not signed in."}

# Initialises a new database. 
def startNewDatabase():
	database.init_db()
	return "Database initiated"

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

# Checks if the given email belongs to a registred user and that the given password corresponds to that user.
# Parameters: 'email' (type: String) 'password' (type: Sting)
# Returns: (type: boolean) 
def __validate(email, password):
	if ((email in db.dummyUsers.keys()) and (password == db.dummyUsers[email]['password'])):
		return True
	else:
		return False

# Checks that the token is not used by any other user
# Parameters: 'token' (type: string)
# Returns: (type: boolean)
def __noMultipleSessons(token):
	if token in session:
		return False
	else:
		return True

def __signUpValidation(email, password, repeatPassword):
	if re.match(r"... ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$ ...", email):
		return {'success': False, 'message': 'Invalid email'}
	elif (len(password) < 5):
		return {'success': False, 'message': 'Password must be at least 5 characters long'}
	elif (password != repeatPassword):
		return {'success': False, 'message': 'Passwords are dissimilar'}
	else:
		return {'success': True, 'message': 'Valid signup information'}


# --------- End of private functions ---------
