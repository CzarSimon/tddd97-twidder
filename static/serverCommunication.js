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
	//history.replaceState(null,'','/');
	var form = "email=" + email + "&password=" + password;
	sendPost('POST', 'sign-in', form, function(response) {
		console.log(typeof(this))
		if (this.success == true) {
			console.log(this.message);
			setMyToken(this.data);
			displayView('profileview');
			websocketfunction();
			history.pushState({},'','/profile');
		} else {
			console.log(this.message);
			displayErrorMessage(this.message);
		}
	});
}

signOutServer = function(token) {
	//history.replaceState(null,'','/');
	var form = "token=" + token;
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

messageToServer = function(token, email, message) {
	//history.replaceState(null,'','/');
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
	//history.replaceState(null,'','/');
	console.log('in getMessagesFromServer');
	var form = "";
	var route = "";
	var otherWall = "";
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

changePasswordThruServer = function(token, oldPassword, newPassword) {
	//history.replaceState(null,'','/');
	var form = "token=" + token + "&oldPassword=" + oldPassword + "&newPassword=" + newPassword;
	sendPost('POST', 'change-password', form, function(response) {
		displayChangePasswordResult(this)		
	});
}

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
