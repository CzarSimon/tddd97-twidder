from flask import session
import database_helper as db, json

# ----- Public functions -----

"""
Changes the users password if he/she is logged in, and supplies the correct
old password and a acceptably formated new password.
Parameters: 'token', 'oldPassword', 'newPassword' (type: string)
Reurtns: JSON object consisting of 'success' (type: boolean), 'message' (type: string)
"""
def changePassword(token, oldPassword, newPassword):
	if token in session:
		email = session[token] # Reurtns the email of the logged in user
		checkPassword = __checkNewPassword(email, newPassword, oldPassword)
		if checkPassword['success']:
			db.change_password(email, newPassword)
		returnData = json.dumps(checkPassword)
	else:
		returnData = json.dumps({	'success': False, 
									'message': 'Not logged in'})
	return returnData

""" 
Get the logged in users email and calls getUserDataByToken
Parameters: 'token' (type: 'string')
Retruns: See comments for getUserDataByEmail
"""
def getUserDataByToken(token):
	email = session[token]
	return getUserDataByEmail(token, email)

"""
Checks that the user is logged in and returns the user data if so.
"""	
def getUserDataByEmail(token, email):
	if token in session:
		userData = db.get_user_data_by_email(email)
		if userData is not None:
			userDict = __userInfoDict(userData)
			return json.dumps({	'success': True, 
								'message': 'User data retrived.', 
								'data': userDict})
		else:
			return json.dumps({	"success": False,
					 			"message": "No such user."})
	else:
		return json.dumps({	"success": False,
							"message": "You are not signed in."})		

"""
Gets the logged in users email and calls getUserMessagesByEmail.
Parameters: 'token' (type: 'string')
Returns: See comments for get getUserMessagesByEmail
"""
def getUserMessagesByToken(token):
	email = session[token]
	return getUserMessagesByEmail(token, email)

# Returns the email of the user with the given token
def getSessionEmail(token):
	return session[token]

"""
Gets the messages of the user with the given email.
Returns them in a JSON object
"""
def getUserMessagesByEmail(token, email):
	parsedMessaages = __parseMessages(db.get_user_message_by_email(email))
	if len(parsedMessaages)  > 0:
		return json.dumps({ 'success': True,
							'message': 'Messages retreved',
							'data': parsedMessaages})
	else:
		return json.dumps({ 'success': False,
							'message': 'No such user'})

"""
Post a message to the wall of the user with the given email. 
First checks that the current user is logged in, then that the email
belongs to a registred user, if both are true the given message is posted
Parameters: 'token', 'email', 'message' (type: string)
Reurtns: JSON object consisting of 'success' (type: boolean), 'message' (type: string)
"""
def postMessage(token, email, message):
	if token in session:
		if (email == 'my email'):
			email = session[token]
		else:
			pass

		if db.get_user_data_by_email(email) is not None:
			if len(message) > 50:
				return json.dumps({	'success': False,
									'message': 'Message must be 50 characters or shorter.'})				
			else:
				db.post_message(session[token], message, email) # session[token] is the email of the logged in user 
				return json.dumps({	'success': True,
									'message': 'Message posted'})
		else:
			return json.dumps({ 'success': False,
								'message': 'No such user'})
	else:
		return json.dumps({	'success': False, 
							'message': 'You are not signed in'})



# ----- End of public functions -----

# ----- Private functions -----

# Gets the numer of signed up users and messages on the entire site.
# Returns them in a dictionary.
def getDataUpdate():
	numberOfMessages = db.number_of_messages()
	numberOfUsers = db.number_of_users()
	return {'users': numberOfUsers, 'messages': numberOfMessages}

def numberOfMessagesOnMyWall(email):
	return {'myMessages': db.messages_on_my_wall(email)}

"""
Checks that the old password was correct and that the new one was
at least five characters long.
Parameters: 'email', 'newPassword', 'oldPassword' (type: string)
Retruns: Dictionary consiting of 'success' (type: boolean), 'message' (type: string)
"""
def __checkNewPassword(email, newPassword, oldPassword):
	if (db.compare_password(email,oldPassword)):
		if (len(newPassword) > 4):
			return {'success': True, 
					'message': 'New passwod accepted'}
		else:
			return {'success': False, 
					'message': 'New passwod to short'}
	else:
		return {'success': False, 
				'message': 'Old passwod was incorrect'}

"""
Converts messages retrived form the database into a list of dictonaries that
cant be sent converted into json.
Parameters: 'messages' (type: list of sqlite rows)
Retruns: 'parsedMessages' (type: list of dictonaries)
"""
def __parseMessages(messages):
	parsedMessages = []
	for i in range(0,len(messages)):
		parsedMessages = [{'message': messages[i][3], 'sender': messages[i][1]}] + parsedMessages
	return parsedMessages

def __userInfoDict(userData):
	userDict = {'email': 		userData[0],
				'firstname': 	userData[2],
				'familyname':	userData[3],
				'gender':		userData[4],
				'city':			userData[5],
				'country':		userData[6]}
	return userDict

# ----- End of private functions -----