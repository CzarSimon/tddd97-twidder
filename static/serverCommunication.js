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

signInServer = function(email, password) {
	var form = "email=" + email + "&password=" + password;
	sendPost('POST', 'sign-in', form, function(response) {
		console.log(typeof(this))
		if (this.success == true) {
			console.log(this.message);
			setMyToken(this.data);
			displayView('profileview');
		} else {
			console.log(this.message);
			displayErrorMessage(this.message);
		}
		websocketfunction();
	});
}

signOutServer = function(token) {
	var form = "token=" + token;
	sendPost('POST', 'sign-out', form, function(response) {
		console.log(this.message);
		if (this.success) {
			setMyToken('logged out');
			displayView("welcomeview");
		}
	});
}

messageToServer = function(token, email, message) {
	console.log('in messageToServer');
	var form = "token=" + token + "&email=" + email + "&message=" + message;
	sendPost('POST', 'post-message', form, function(response) {
		console.log(this.message);
		if (email == "my email") {
			getMessagesFromServer(token);
		} else {
			generateGuestWall(email);
		}
	});
}

getMessagesFromServer = function(token, email) {
	console.log('in getMessagesFromServer');
	var form = "";
	var route = "";
	var otherWall = "";
	if (email == 'my wall') {
		form = "token=" + token;
		route = "my-wall";
		otherWall = false
	} else {
		form = "token=" + token "&email=" + email;
		route = "other-wall";
		otherWall = true
	}
	sendPost('POST', route, form, function(response) {
		console.log(this.success)
		if (this.success) {
			generateWall(this.data, otherWall);
		} 
	});
}

getUserFromServer = function(token, email) {
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
			checkUsers(this.data, email);
			closeSearch();	
		} else {
			var searchField = document.getElementById("search-bar");
			failedSearch(searchField, this.message);
		}
	});
}

changePasswordThruServer = function(token, oldPassword, newPassword) {
	var form = "token=" + token + "&oldPassword=" + oldPassword + "&newPassword=" + newPassword;
	sendPost('POST', 'change-password', form, function(response) {
		displayChangePasswordResult(this)		
	});
}

