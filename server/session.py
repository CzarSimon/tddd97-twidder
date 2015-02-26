class session(object):
	"""This is a session object containing a list
	   of all loged in users"""

	sessionCount = 0

	def __init__(self, token, email):
		self.token = token
		self.email = email
		session.sessionCount += 1

	def getCount(self):
		return session.sessionCount
		
	def tokenToEmail(token):
		if token == self.token:
			return self.email
		else:
			return None

	def getToken():
		if sessionCount > 0:
			return self.token
		else:
			return None