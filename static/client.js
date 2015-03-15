var root_url = "http//:127.0.0.1:5000/"


displayView = function(currentView){
	$('body').html(document.getElementById(currentView).text);
	setViewStyle(currentView);
	//$('body').css('background-size', '110% 130%')
}

function setViewStyle(view) {
	var bod = document.body.style;
	if (view == "welcomeview") {
		bod.backgroundColor = '#FFFFFF';
		localStorage.setItem('onPage', 'loggedout');
	} else if (view == "profileview") {
		//bod.backgroundImage = '';
		bod.backgroundColor = '#E8EAF6';
		if (document.getElementById("side-menu").style.height < window.innerHeight) {
			document.getElementById("side-menu").style.height = window.innerHeight + 'px';
		}
		wallClick();
		//myProfile();
		localStorage.setItem('onPage', 'mine');
	}
}

$(window).resize(function(){
	if (window.innerWidth < 768) {
		var sideMenu = $('#side-menu');
		sideMenu.hide();

	} else {
		var sideMenu = $('#side-menu');
		sideMenu.show();
	}
})

function toggleMenu() {
	if (window.innerWidth < 768) {
		$('#side-menu').toggle();
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
	var login = document.getElementById('login-form');
	var signup = document.getElementById('signup-form');
	if (signup.style.display == 'none')	{
		login.style.display = 'none';
		signup.style.display = 'block';
		console.log('signup');
	} else {
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
			signup.style.display = 'none';
			login.style.display = 'block';
			signUp();
		}
	}	
}

function signUp() {
	console.log('in signUp')
	var form = document.getElementsByClassName("signup-form");
	signUpServer(form[0].value, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, form[7].value)
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
	
    //alert(serverstub.signUp(formData)["message"]);
    loginClick(formData["email"],formData["password"]);
}

loginClick = function(email, password) {
	var login = document.getElementsByClassName("login-form");
	email = email || login[0].value;
	password = password || login[1].value

	var user = serverstub.signIn(email,password);
	if (user["success"]) {
		setMyToken(user["data"]);
		displayView("profileview");	
	} else {
		displayErrorMessage(user["message"]);
	}
}

websocketfunction = function() {
	var loc = window.location, new_uri
	if (loc.protocol === "https") {
			new_uri = "wsss:";
		} else {
			new_uri = "ws:";
		}
	new_uri +=  "//" + loc.host;
	new_uri += loc.pathname + "sign-in";
	var ws = new WebSocket(new_uri);
	ws.onmessage = function(response){
		console.log(response.data);
		if (response.data == getMyToken()) {
			console.log('Utloggad!')
			logoutClick();
		}
	}
	ws.onclose = function() {
		console.log("We have crashlanded!");
	}
	ws.onopen = function() {
		console.log("We have blastoff!");
		ws.send(getMyToken());
	}
}

login = function(email, password) {
	var login = document.getElementsByClassName("login-form");
	email = email || login[0].value;
	password = password || login[1].value

	signInServer(email,password);
}


setMyToken = function(token) {
	localStorage.setItem("myToken", token);
}

getMyToken = function() {
	return localStorage.getItem("myToken");
}

localTokenToStorage = function() {
	
}

function myProfile() {
	console.log('in myProfile')
	exitOtherMembersPage();
	getUserFromServer(getMyToken());
}

checkUsers = function(user,email) {
	console.log('in checkUsers')
	var userInfo = "";
	if (email == null) {
 		userInfo = "<div id='change-password' class='col-md-6 col-xs-12'>\
 			<input type='password' class='change-password' placeholder='Old password' style='display: none'></input>\
 			<input type='password' class='change-password' placeholder='New password' style='display: none'></input>\
 		<button id='password-button' class='info-button' onClick='return changePassword()'>Change password</button></div>"
	} else {
		localStorage.setItem('onPage', user.email);
		var toWall = '"' + user.email + '"';
		var clickInstructions = "return generateGuestWall(" + toWall + ")" + "'";
		document.getElementById("new-message").placeholder = "Give " + user.firstname + " a pieace of your mind, bro!";
		userInfo = "<div id='change-password' class='col-md-6 col-xs-12'>\
		<button class='info-button' onClick='" + clickInstructions + ">Check out that wall</button></div>"
	}

	userInfo = "<div class='content-box profile-box col-md-10 col-md-offset-1'><div id='user-info' class='col-md-6 col-xs-12'>\
				<p>Name: &nbsp &nbsp" + user["firstname"] + " " + user["familyname"] + "</p>\
				<p>Email: &nbsp &nbsp" + user["email"] + "</p>\
				<p>Gender: &nbsp" + user["gender"] + "</p>\
				<p>City: &nbsp &nbsp &nbsp " + user["city"] + "</p>\
				<p>Country: " + user["country"] + "</p></div>" + userInfo + "</div>";

	menuSelector("profile-li");
	document.getElementById("content").innerHTML = userInfo;
}

logoutClick = function() {
	signOutServer(getMyToken());
}

function exitOtherMembersPage() {
	localStorage.setItem('onPage','mine');
	document.getElementById("new-message").placeholder = "What up hipsta?!";
}

function searchClick() {
	menuSelector("search-li");
	document.getElementById("search-blur").style.display = 'block';
	document.getElementById('search-bar').focus();
}

function wallClick(email) {
	console.log('wallClick')
	menuSelector("wall-li");
	exitOtherMembersPage();
	getMessagesFromServer(getMyToken(), 'my wall');	
}

function aboutClick() {
	serverstub.postMessage(getMyToken(),'This is a message by the autoPoster');	
}

function menuSelector(listId) {
	var prevClick = localStorage.getItem("prevMenuClick");
	if (prevClick == "" || prevClick == null) {
		document.getElementById(listId).style.borderRightWidth = '8px';		
	} else {
		document.getElementById(prevClick).style.borderRightWidth = '0px';
		document.getElementById(listId).style.borderRightWidth = '8px';
	}
	localStorage.setItem("prevMenuClick", listId);
}

function newMessages(oldLength,messages) {
	console.log('in newMessages')
	var length = messages.length - oldLength;
	var newContent = '';
	var clickInstructions = ""; 
	var author = "";

	for (var i = 1; i < length + 1; i++) {
		author = '"' + messages[length - i].sender + '"';
		clickInstructions = "return searchUser(" + author + ")" + "'";
		newContent = '<div class="content-box message-box col-md-3 col-sm-11 col-xs-11"><p class="message-text">'
		 + messages[length - i].message
		 + "</p><p><a class='author' href='' onClick='" + clickInstructions + ">" + messages[length - i].sender 
		 + "</a></p></div>" + newContent;
	}
	return newContent;
}

function generateGuestWall(email) {
	console.log('in generateGuestWall')
	menuSelector("wall-li");
	console.log(email)
	getMessagesFromServer(getMyToken(), email);
}

function generateWall(messages, otherWall) {
	console.log('in generateWall')
	var oldWallLength = 0;
	if (!otherWall || localStorage.getItem('onPage') != 'mine') {
		oldWallLength = document.getElementsByClassName("content-box message-box").length;
	}

	var newContent = newMessages(oldWallLength,messages);
	var content = document.getElementById("content");

	if (oldWallLength > 0) {
		content.innerHTML = newContent + content.innerHTML;	
	} else {
		content.innerHTML = newContent;
	}
}

function getNewMessage() {
	var message = document.getElementById("new-message").value;
	var toMail = ""
	if (localStorage.getItem('onPage') != 'mine') {
		toMail = localStorage.getItem('onPage');
		//generateGuestWall(toMail);
	} else {
		toMail = 'my email';
		//generateWall(token);
	}
	messageToServer(getMyToken(), toMail, message);

	document.getElementById("new-message").value = "";
	document.getElementById("new-message").blur();
	return false;
}

function printSearchOptions(match) {
	var options = "<div id='search-options'><div id='infoOption'><h1>Info</h1></div><div id='wallOption'><h1>Wall</h1></div></div>"
	var place = document.getElementById("search-blur")

	place.innerHTML = place.innerHTML + options;
}

function searchUser(clickedSearch) {
	console.log('in searchUser');
	exitOtherMembersPage();
	var searchField = document.getElementById("search-bar");
	if (clickedSearch == null) {
		getUserFromServer(getMyToken(), searchField.value)
	} else {
		getUserFromServer(getMyToken(), clickedSearch);
	}
	return false;
}

function failedSearch(field,message) {
	var color = field.style.color;
	field.style.color = 'red';
	field.value = message;

	setTimeout(function(){
		field.value = '';
		field.style.color = color;
	},800);
}

function closeSearch() {	
	var searchField = document.getElementById("search-bar");
	searchField.value = "";
	searchField.blur();
	document.getElementById("search-blur").style.display = 'none';
}

function displayChangePasswordResult(result) {
	console.log('in displayChangePasswordResult')
	console.log(result.message);
	var password = document.getElementsByClassName("change-password");
	var button = document.getElementById("password-button");

	if (result.success) {
		password[0].value = "";			
		password[1].value = "";
		password[0].style.display = 'none';
		password[1].style.display = 'none';
		button.style.marginTop = '30%';
		button.blur();	
	} else {
		password[0].setAttribute('type','text');
		failedSearch(password[0],result.message);
		password[1].value = "";
		password[0].focus(); 
	}
	console.log(result.message);
}

function changePassword() {
	console.log('in changePassword')
	var password = document.getElementsByClassName("change-password");
	var button = document.getElementById("password-button");

	if (password[0].style.display == "none") {
		password[0].style.display = 'block';
		password[1].style.display = 'block';
		button.style.marginTop = '2.1em';
		password[0].focus();	
	} else {
		console.log(password[0].value + ' ' + password[1].value)
		changePasswordThruServer(getMyToken(),password[0].value,password[1].value);
	}
	return false;
}

function refreshClick() {
	console.log('in refreshClick')
	if (document.getElementById('wall-li').style.borderRightWidth == '8px') {
		var onPage = localStorage.getItem('onPage');
		if (onPage == 'mine') {
			wallClick();
		} else {
			generateGuestWall(onPage);
			console.log('Refreshed');
		}
	}
}