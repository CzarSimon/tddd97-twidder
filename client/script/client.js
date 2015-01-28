displayView = function(currentView){
	$('body').html(document.getElementById(currentView).text);
	$('body').css('background-size', '110% 130%')
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
		expandBox("signUp","error-message", false);
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
}

loginClick = function() {
	var login = document.getElementsByClassName("login-form");

	var user = serverstub.signIn(login[0].value,login[1].value);
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
	var users = localStorage.getItem("loggedinusers");
	console.log(users);
	console.log(getMyToken());
}

logoutClick = function() {
	console.log(serverstub.signOut(getMyToken())["message"]);
	setMyToken("logged out");
	displayView("welcomeview");	
}

