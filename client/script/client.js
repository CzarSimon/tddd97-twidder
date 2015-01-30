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
		localStorage.setItem('onPage', 'loggedout');
	} else if (view == "profileview") {
		bod.backgroundImage = '';
		bod.backgroundColor = '#E8EAF6';
		document.getElementById("side-menu").style.height = window.innerHeight + 'px';
		wallClick();
		//myProfile();
		localStorage.setItem('onPage', 'mine');
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

function myProfile() {
	exitOtherMembersPage();
	checkUsers(serverstub.getUserDataByToken(getMyToken())["data"]);
}

checkUsers = function(user) {
	var userInfo = ""
	var loggedInUser = serverstub.getUserDataByToken(getMyToken())["data"];
	if (user.email == loggedInUser.email) {
 		user = loggedInUser;
 		userInfo = "<div id='change-password'>\
 			<input type='password' class='change-password' placeholder='Old password' style='display: none'></input>\
 			<input type='password' class='change-password' placeholder='New password' style='display: none'></input>\
 		<button id='password-button' class='info-button' onClick='return changePassword()'>Change password</button></div>"
	} else {
		localStorage.setItem('onPage', user.email);
		var toWall = '"' + user.email + '"';
		var clickInstructions = "return generateGuestWall(" + toWall + ")" + "'";
		document.getElementById("new-message").placeholder = "Give " + user.firstname + " a pieace of your mind, bro!";
		userInfo = "<div id='change-password'>\
		<button class='info-button' onClick='" + clickInstructions + ">Check out that wall</button></div>"
	}

	userInfo = "<div class='content-box profile-box'><div id='user-info'>\
				<p>Name: &nbsp &nbsp" + user["firstname"] + " " + user["familyname"] + "</p>\
				<p>Email: &nbsp &nbsp" + user["email"] + "</p>\
				<p>Gender: &nbsp" + user["gender"] + "</p>\
				<p>City: &nbsp &nbsp &nbsp " + user["city"] + "</p>\
				<p>Country: " + user["country"] + "</p></div>" + userInfo + "</div>";

	menuSelector("profile-li");
	document.getElementById("content").innerHTML = userInfo;
}

logoutClick = function() {
	console.log(serverstub.signOut(getMyToken())["message"]);
	setMyToken("logged out");
	displayView("welcomeview");	
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

function wallClick() {
	menuSelector("wall-li");
	exitOtherMembersPage();
	generateWall(getMyToken());
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
	var length = messages.length - oldLength;
	var newContent = '';
	var clickInstructions = ""; 
	var author = "";

	for (var i = 1; i < length + 1; i++) {
		author = '"' + messages[length - i].writer + '"';
		clickInstructions = "return searchUser(" + author + ")" + "'";
		newContent = '<div class="content-box message-box"><p>'
		 + messages[length - i].content
		 + "</p><p><a class='author' href='' onClick='" + clickInstructions + ">" + messages[length - i].writer 
		 + "</a></p></div>" + newContent;
	}
	return newContent;
}

function generateGuestWall(email) {
	var messages = serverstub.getUserMessagesByEmail(getMyToken(),email);
	var newContent = newMessages(0, messages.data);
	document.getElementById("content").innerHTML = newContent;
	menuSelector("wall-li");
}

function generateWall(token) {
	var oldWallLength = document.getElementsByClassName("content-box message-box").length;
	var messages = serverstub.getUserMessagesByToken(token).data;
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
	var token = getMyToken();
	if (localStorage.getItem('onPage') != 'mine') {
		var toMail = localStorage.getItem('onPage');
		serverstub.postMessage(token, message,toMail);
		generateGuestWall(toMail);
	} else {
		serverstub.postMessage(token, message);
		generateWall(token);
	}

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
	if (clickedSearch == serverstub.getUserDataByToken(getMyToken()).data.email) {
		document.getElementById("search-bar").value = clickedSearch;
		clickedSearch = null;
		exitOtherMembersPage();
	}
	var searchField = document.getElementById("search-bar");
	if (clickedSearch == null) {
		console.log('inside null');
		var match = serverstub.getUserDataByEmail(getMyToken(), searchField.value);

		if (match.success) {
			//searchField.value = match.data["firstname"] + " " + match.data["familyname"];	
			checkUsers(match.data);
			closeSearch();
		} else {
			failedSearch(searchField, match.message);
		}
	} else {
		var match = serverstub.getUserDataByEmail(getMyToken(), clickedSearch);
		checkUsers(match.data);
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
	},600);
}

function closeSearch() {	
	var searchField = document.getElementById("search-bar");
	searchField.value = "";
	searchField.blur();
	document.getElementById("search-blur").style.display = 'none';
}

function changePassword() {
	var password = document.getElementsByClassName("change-password");
	var button = document.getElementById("password-button");

	if (password[0].style.display == "none") {
		password[0].style.display = 'block';
		password[1].style.display = 'block';
		button.style.marginTop = '2.1em';
		password[0].focus();	
	} else {
		var result = {"success": false, "message": "New password was to short"};
		if (password[1].value.length > 4) {
			result = serverstub.changePassword(getMyToken(),password[0].value,password[1].value);
		}
		if (result["success"]) {
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

	return false;
}

function refreshClick() {
	if (document.getElementById('wall-li').style.borderRightWidth == '8px') {
		var onPage = localStorage.getItem('onPage');
		if (onPage == 'mine') {
			generateWall(getMyToken());
		} else {
			generateGuestWall(onPage);
			console.log('Refreshed');
		}
	}
}


