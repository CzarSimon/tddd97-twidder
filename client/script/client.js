displayView = function(currentView){
	$('body').html(document.getElementById(currentView).text);
	setViewStyle(currentView);
	//$('body').css('background-size', '110% 130%')
}

function setViewStyle(view) {
	var bod = document.body.style;
	if (view == "welcomeview") {
		bod.backgroundImage = 'url("../images/loginImg2.jpg")';
		$('body').css('background-size', '110% 130%');
	} else if (view == "profileview") {
		bod.backgroundImage = '';
		bod.backgroundColor = '#E8EAF6';
		console.log(window.innerHeight);
		document.getElementById("side-menu").style.height = window.innerHeight + 'px';
	}
}

window.onload = function(){
	var view = 'null';

	if (getMyToken() == null || getMyToken() == "logged out") {
		view = "welcomeview";
	} else {
		view = "profileview";
	}
	displayView(view);
}

displayErrorMessage = function(message) {
	var div = document.getElementById("error-box");
	var p = document.getElementById("error-message");

	if (message == "nothing") {
		p.innerHTML = message;
		div.style.display = 'none';
	} else {
		if (p.innerHTML != message) {
			p.innerHTML = message;		
		}
		div.style.display = 'block';
	}	
}

hasEmptyFields = function(formClass) {
	form = document.getElementsByClassName(formClass);

	for (i=0; i<form.length; i++) {
		if (form[i].value == "") {
			return true;
		} 
	}
}

validEmail = function() {
	var email = document.getElementById("email-SU").value;
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

signupClick = function() {
	var errorMessage = "nothing";
	var password = document.getElementById("password-SU").value;

	if (hasEmptyFields("signup-form") == true) {
		errorMessage = "All fields must be filed";
	} else if (validEmail() == false) {
		errorMessage = "Invalid email"
	} else if (password.length < 5) {
		errorMessage = "The password must be at least 5 charactes long"
	} else if (password != document.getElementById("repeatPassword-SU").value) {
		errorMessage = "Not the same as password";
	}

	displayErrorMessage(errorMessage);
	if (errorMessage == "nothing") {
		checkSignUpForm();
	}	
}

function checkSignUpForm() {

	var formData = [];
	var form = document.getElementsByClassName("signup-form");

	formData["firstname"] =  form[0].value; 
	formData["familyname"] =  form[1].value; 
	formData["gender"] =  form[2].value; 
	formData["city"] =  form[3].value;
	formData["country"] =  form[4].value;
	formData["email"] =  form[5].value; 
	formData["password"] =  form[6].value; 
	
    alert(serverstub.signUp(formData)["message"]);
    loginClick(formData["email"],formData["password"]);
}

loginClick = function(email, password) {
	var login = document.getElementsByClassName("login-form");
	email = email || login[0].value;
	password = password || login[1].value

	var user = serverstub.signIn(email,password);
	if (user["success"]) {
		setMyToken(user["data"]);
		console.log(getMyToken());
		displayView("profileview");	
	} else {
		displayErrorMessage(user["message"]);
	}
}

setMyToken = function(token) {
	localStorage.setItem("myToken", token);
}

getMyToken = function() {
	return localStorage.getItem("myToken");
}

checkUsers = function() {
	var user = serverstub.getUserDataByToken(getMyToken())["data"];

	var userInfo = "<p>Name: " + user["firstname"] + " " + user["familyname"] + "</p>\
					<p>Email: " + user["email"] + "</p>\
					<p>Gender: " + user["gender"] + "</p>\
					<p>City: " + user["city"] + "</p>\
					<p>Country: " + user["country"] + "</p>\
					<button>Change password</button>";

	console.log(user["password"]);
	document.getElementById("content").innerHTML = userInfo; 

}

logoutClick = function() {
	console.log(serverstub.signOut(getMyToken())["message"]);
	setMyToken("logged out");
	displayView("welcomeview");	
}

