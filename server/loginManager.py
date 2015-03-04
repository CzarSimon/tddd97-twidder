from flask import session
import random, re
import databaseStub as db

# --------- Public functions ---------

# Checkes that the entered email is registred and that the password corresponds to the registred one.
# If successfull: logges in the user and assigns it a random token.
# If unsucessfull: Fails to log in.
# Parameters: 'email' (type: string), 'password' (type: string)
# Returns: Dictionary consisting of 'success' (type: boolean), 'message' (type: string), 'data' (type: session class object)
def signIn(email, password):
	if __validate(email, password):
		#token = __setToken() 
		token = db.getMyToken() # Will be removed when connected.
		if __noMultipleSessons(token):
			session[token] = email 		
			return {'success': True, 'message': 'Successfully signed in.', 'data': token}
		else:
			return {'success': False, 'message': 'Wrong username or password.'}
	else:
		return {'success': False, 'message': 'Wrong username or password.'}


def signUp(email, password, repeatPassword, firstname, familyname, gender, city, country):
	validInfo = __signUpValidation(email, password, repeatPassword)
	if validInfo['success']:
		signIn(email, password)
		# Add the user info to the database.

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

def tempSendToken():
	return db.getMyToken()