/*
Callback functon that handles all xmlhttp requests. It calls the route, given as a parameter, in 
server.py with the given method and form data. Upon success it performs the given callback functions.
*/
var sendPost = function(method, route, form, callback) {
	var xmlhttp; 
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			console.log(JSON.parse(xmlhttp.responseText));
			callback.call(JSON.parse(xmlhttp.responseText));
		}
	}	
	xmlhttp.open(method, route, "true");
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(form)
}

/*
Calls signIn in server.py, assigns the user a token, a websocket and displayst the profile view for the logged in user.
*/
signInServer = function(email, password) {
	//history.replaceState(null,'','/');
	var form = "email=" + email + "&password=" + password;
	sendPost('POST', 'sign-in', form, function(response) {
		console.log(typeof(this))
		if (this.success == true) {
			console.log(this.message);
			setMyToken(this.data);
			displayView('profileview');
			websocketfunction();
		} else {
			console.log(this.message);
			displayErrorMessage(this.message);
		}

	});
}

/*
Calls signOut in server.py, drops the users token and displays the welcome view for the logged out user.
*/
signOutServer = function(token,email) {
	//history.replaceState(null,'','/');
	var form = "token=" + token + "&email=" + email;
	sendPost('POST', 'sign-out', form, function(response) {
		console.log(this.message);
		if (this.success) {			
			localStorage.setItem('userEmail','');
			localStorage.setItem('prevMenuClick','profile-li');
			window.history.replaceState({},'','/');
			setMyToken('logged out');
			displayView("welcomeview");
		}
	});
}

/*
Sends a message to server.py, if it was succefully posted the wall it was sent to is generated
*/
messageToServer = function(token, email, message) {
	history.replaceState(null,'','/');
	console.log('in messageToServer');
	var form = "token=" + token + "&email=" + email + "&message=" + message;
	console.log(form)
	sendPost('POST', 'post-message', form, function(response) {
		console.log(this.message);
		if (this.success) {	
			if (email == "my email") {
				getMessagesFromServer(token);
			} else {
				console.log(email);
				generateGuestWall(email);
			}
		}
	});
}

/*
Retrives messages belonging to a user that is identified by either email or token.
If messages beloning to that user is found they are sent to generateWall() in client.js
*/
getMessagesFromServer = function(token, email) {
	//history.replaceState(null,'','/');
	console.log('in getMessagesFromServer');
	var form = "";
	var route = "";
	var otherWall = ""; //tells generateWall() if the user wants to view another users wall
	if (email == 'my wall' || email == null) {
		form = "token=" + token;
		route = "my-wall";
		otherWall = false
	} else {
		form = "token=" + token + "&email=" + email;
		route = "other-wall";
		otherWall = true
	}
	sendPost('POST', route, form, function(response) {
		console.log(this.success)
		if (this.success) {
			generateWall(this.data, otherWall);
			/*
			if (email == 'my wall'){
				history.pushState(null,'','wall/' + localStorage.getItem('userEmail'));
			} else {
				history.pushState(null,'','wall/' + email);
			}
			*/
		} 
	});
}

/*
Retrives user data from server.py using either token or email.
If the data is retrived successfully checkUsers() and closeSearch() in client.js is called.
If the data is not found in the database an error message is sent to the user.
*/
getUserFromServer = function(token, email) {
	//history.replaceState(null,'','/');
	console.log('in getUserFromServer')
	var form = "";
	var route = "";
	if (email == null) {
		form = "token=" + token;
		route = 'get-user-data-by-token';
	} else {
		form = "token=" + token + "&email=" + email;
		route = 'get-user-data-by-email';
	}
	sendPost('POST', route, form, function(response) {
		console.log(route)
		if (this.success) {
			/*
			if (route == 'get-user-data-by-email') {
				history.pushState(null,'','search/' + this.data.email);
			} else if (route == 'get-user-data-by-token'){
				history.pushState(null,'','profile/' + this.data.email);
			}*/
			checkUsers(this.data, email);
			closeSearch();	
		} else {
			var searchField = document.getElementById("search-bar");
			failedSearch(searchField, this.message);
		}
	});
}

/*
Calls changePassword in server.py.
*/
changePasswordThruServer = function(token, oldPassword, newPassword) {
	//history.replaceState(null,'','/');
	var form = "token=" + token + "&oldPassword=" + oldPassword + "&newPassword=" + newPassword;
	sendPost('POST', 'change-password', form, function(response) {
		displayChangePasswordResult(this)		
	});
}

/*
Calls signUp in server.py with the user info that the user has provided.
If the user was successfully signed up, signInServer in this module is called.
*/
signUpServer = function(firstname, familyname, gender, city, country, email, password, repeatPassword) {
	console.log('in signUpServer')
	//history.replaceState(null,'','/');
	var form = "email=" + email + "&password=" + password + "&repeatPassword=" + repeatPassword + "&firstname=" + firstname + "&familyname=" + familyname + "&gender=" + gender + "&city=" + city + "&country=" + country;
	sendPost('POST', 'sign-up', form, function(response) {
		if (this.success) {
			signInServer(email, password);
		}
	});
}
