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
	var form = "token=" + token + "&email=" + email + "&message=" + message;
	sendPost('POST', 'post-message', form, function(response) {
		console.log(this.message);
	});
}