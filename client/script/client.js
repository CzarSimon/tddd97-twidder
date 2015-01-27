displayView = function(currentView){	
	$('body').append(document.getElementById(currentView).text);
	$('body').css('background-size', '110% 130%')
}


window.onload = function(){
	var view = 'null';

	if (localStorage.getItem("loggedinusers") == null) {
		view = "welcomeview";
	} else {
		view = "profileview";
	}
		
	displayView(view);
}

expandBox = function(boxID, newElement, expand) {
	var box = document.getElementById(boxID);
	var newHeight = 278 + expand*document.getElementById(newElement).offsetHeight;

	if (expand == true) {
		box.setAttribute("style","height: " + newHeight + "px")	
	} else {
		box.setAttribute("style","height: 276px")
	}
}

displayErrorMessage = function(message) {
	//var div = document.getElementById("error-message-box");
	var p = document.getElementById("error-message");

	if (message == "nothing") {
		expandBox("signUp","error-message", false);
		p.innerHTML = message;
		p.style.display = 'none'; // changed from div
	} else {
		if (p.innerHTML != message) {
			p.innerHTML = message;		
		}
		p.style.display = 'block'; //  changed from div	
		expandBox("signUp","error-message", true)
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
    console.log(re.test(email));
    return re.test(email);
}

signupClick = function() {
	var errorMessage = "nothing";
	var password = document.getElementById("password-SU").value;

	console.log(password);
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

