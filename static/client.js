var root_url = "http//:127.0.0.1:5000/"

/*------------------- DISPLAY FUNCTIONS ---------------------------__*/

/* Function that loads at the opening of the page and
calls the displayView function*/

window.onload = function(){
	var view = 'null';

	if (getMyToken() == null || getMyToken() == "logged out") {
		view = "welcomeview";
	} else {
		view = "profileview";
	}
	displayView(view);
}

/*Prepares the document and calls the setViewStyle function
Handles so that the user is directed to the correct page when refreshing the page*/

displayView = function(currentView){
	$('body').html(document.getElementById(currentView).text);
	var view = localStorage.getItem('prevMenuClick');
	if (view  == 'wall-li'){
		wallClick();
	} else if (view == 'profile-li') {
		myProfile();
	} else if (view == 'search-li') {
		searchClick();
	} else if (view == 'about-lie') {
		aboutClick();
	}
	setViewStyle(currentView);
}

/*Determines wether the Welcome-view or the Profile-view
should be displayed to the user*/

function setViewStyle(view) {
	var bod = document.body.style;
	if (view == "welcomeview") {
		localStorage.setItem('prevMenuClick', 'profile-li');
		bod.backgroundColor = '#FFFFFF';
		localStorage.setItem('onPage', 'loggedout');
	} else if (view == "profileview") {
		bod.backgroundColor = '#E8EAF6';
		if (document.getElementById("side-menu").style.height < window.innerHeight) {
			document.getElementById("side-menu").style.height = window.innerHeight + 'px';
		}
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

/*Drawing function that draws the profile page, it will draw 
diffrently depending on if it is the users own profile page or 
another users page*/

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

/* Function that displays messages posted on a wall
to the user */

function newMessages(oldLength,messages) {
	console.log('in newMessages')
	var length = messages.length - oldLength;
	var newContent = '';
	var clickInstructions = ""; 
	var author = "";

	for (var i = 1; i < length + 1; i++) {
		author = '"' + messages[length - i].sender + '"';
		clickInstructions = "return searchUser(" + author + ")" + "'";
		newContent = '<div class="content-box message-box col-md-3 col-sm-11 col-xs-11" draggable="true" ondragstart="drag(event)"><p class="message-text">'
		 + messages[length - i].message
		 + "</p><p><a class='author' draggable='false' href='' onClick='" + clickInstructions + ">" + messages[length - i].sender 
		 + "</a></p></div>" + newContent;
	}
	return newContent;
}

/* Function that highlights which page the user is own in
the navigation menu*/

function menuSelector(listId) {
	console.log('in menuSelector')
	var prevClick = localStorage.getItem("prevMenuClick");
	document.getElementById('wall-li').style.borderRightWidth = '0px';
	document.getElementById('profile-li').style.borderRightWidth = '0px';
	document.getElementById('search-li').style.borderRightWidth = '0px';
	document.getElementById('about-li').style.borderRightWidth = '0px';
	document.getElementById(prevClick).style.borderRightWidth = '8px';
	toggleMenu();
	closeAboutPage();
}


/* Toggles the menu when the screen size is small*/

function toggleMenu() {
	if (window.innerWidth < 768) {
		$('#side-menu').toggle();
	}
}

/*Function that displays error messages to the user 
if something wrong has been done*/

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


/*----------------- WEBSOCKET FUNCTIONS ------------------*/

/* Function that initializes and handles
messages to the websockets*/

websocketfunction = function() {
	var loc = window.location, new_url
	if (loc.protocol === "https") {
			new_url = "wsss:";
		} else {
			new_url = "ws:";
		}
	new_url +=  "//" + loc.host;
	new_url += loc.pathname + "sign-in";
	var ws = new WebSocket(new_url);
	ws.onmessage = function(response){
		console.log(response.data);
		console.log(typeof(response.data), 'response data');
		if (response.data == getMyToken()) {
			localStorage.setItem('myToken','logged out');
			localStorage.setItem('userEmail','');
			setViewStyle("welcomeview");
			window.location.reload()	
		}
		if (JSON.parse(response.data).type == 'live data') {
			console.log(response.data);
			var jsonData = JSON.parse(response.data)
			console.log(jsonData.type);
			publishData(jsonData.liveData);
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

/*--------------------- LOGIN FUNCTIONS --------------*/

/* Function that handles the login of the user */

login = function(email, password) {
	var login = document.getElementsByClassName("login-form");
	email = email || login[0].value;
	password = password || login[1].value;
	localStorage.setItem('userEmail',email);
	signInServer(email,password);
}

/* Saves the users token to a place in the local storage */

setMyToken = function(token) {
	localStorage.setItem("myToken", token);
}

/* returns the users token from the local storage */

getMyToken = function() {
	return localStorage.getItem("myToken");
}

/* Function that brings the user to his profile page*/

function myProfile() {
	console.log('in myProfile')
	menuSelector('profile-li')
	toggleMenu();
	exitOtherMembersPage();
	getUserFromServer(getMyToken());
}



/* Function that starts logging out the user */

logoutClick = function() {
	var bod = document.body.style;
	bod.backgroundColor = '#FFFFFF';
	signOutServer(getMyToken(),localStorage.getItem('userEmail'));
}

/*-------------------- SIGNUP FUNCTIONS----------------*/

/* Validation function that checks if the email entered
is on a correct format*/

validEmail = function() {
	var email = document.getElementById("email-SU").value;
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/* Function that validates the sign up form and 
starts the registration of the user in the database*/

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

/* Continues the signup process and sends a request
the the server to register the user*/

function signUp() {
	console.log('in signUp')
	var form = document.getElementsByClassName("signup-form");
	signUpServer(form[0].value, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, form[7].value)
}

/* Function that validates that every field has been filled in
on the sign-up form*/

hasEmptyFields = function(formClass) {
	form = document.getElementsByClassName(formClass);

	for (i=0; i<form.length; i++) {
		if (form[i].value == "") {
			return true;
		} 
	}
}

/*------------- WALL FUNCTIONS -------------*/


/* Function that is called when the user leaves the profile
page of another user */

function exitOtherMembersPage() {
	localStorage.setItem('onPage','mine');
	document.getElementById("new-message").placeholder = "What up hipsta?!";
}

/* Function that is called when the user clicks on the 
"wall" link in the navigation bar, brings the user to his own wall*/

function wallClick() {
	console.log('wallClick')
	closeSearch();
	menuSelector("wall-li");
	exitOtherMembersPage();
	getMessagesFromServer(getMyToken(), 'my wall');	
}

/*Function that generates the wall of another user */

function generateGuestWall(email) {
	console.log('in generateGuestWall')
	menuSelector("wall-li");
	toggleMenu();
	console.log(email)
	getMessagesFromServer(getMyToken(), email);
}

/* Function that generates the users own wall*/

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

/*Function that fetches new messages to be displayed on a users wall*/

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
	closeAboutPage();
	return false;
}
/*-------------ABOUT FUNCTIONS----------------*/

/* Function that opens the about page */

function aboutClick() {
	menuSelector('about-li');
	closeSearch();
	openAboutPage();
}

/*Function that hides the graphs when the about page is not viewed by the user*/

function closeAboutPage() {
	console.log(document.getElementById('hidden-content').style.display, "hidden-content status")
	if (document.getElementById('hidden-content').style.display == 'block') {
		console.log('it was block')
		document.getElementById('hidden-content').style.display = "none";
	}
}

/*-----------SEARCH FUNCTIONS----------*/

/* Function that starts the search in the database
for a user with a specified email adress*/

function searchUser(clickedSearch) {
	console.log('in searchUser');
	toggleMenu();
	exitOtherMembersPage();
	var searchField = document.getElementById("search-bar");
	if (clickedSearch == null) {
		getUserFromServer(getMyToken(), searchField.value)
	} else {
		getUserFromServer(getMyToken(), clickedSearch);
	}
	return false;
}

/* Function that opens the search-bar */

function searchClick() {
	console.log("Searchwindow opened");
	menuSelector("search-li");
	var searchBlur = document.getElementById("search-blur");
	searchBlur.style.height = window.outerHeight + 'px';
	searchBlur.style.display = 'block';
	document.getElementById('search-bar').focus();
	document.getElementById('content').style.display = 'none';
	document.getElementById('top-bar').style.display = 'none';
}

/*Function that is called when a search for a user has failed*/

function failedSearch(field,message) {
	var color = field.style.color;
	field.style.color = 'red';
	field.value = message;

	setTimeout(function(){
		field.value = '';
		field.style.color = color;
	},800);
}

/* Function that closes the search "window" */

function closeSearch() {
	document.getElementById('content').style.display = 'block';
	document.getElementById('top-bar').style.display = 'block';	
	var searchField = document.getElementById("search-bar");
	searchField.value = "";
	searchField.blur();
	document.getElementById("search-blur").style.display = 'none';
}



/*------------ VARIOUS FUNCTIONS----------------*/

/* Function that displays the result of a password change
to the user */

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

/*Function that changes the password of logged in user */

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

/* Function that refreshes the users wall that the logged in user is currently on*/

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

/*-------- Drag & Drop functions ---------*/

/* Function that allows dropping of objects */

function allowDrop(ev) {
    ev.preventDefault();
}

/* Function that allows objects to be dragged*/

function drag(ev) {
	var img = document.createElement("img");
	img.src = "/static/images/drag-and-drop.png";
	ev.dataTransfer.setDragImage(img, 0, 0);
    ev.dataTransfer.setData("text", ev.toElement.firstChild.innerHTML);
    ev.dataTransfer.setData("author",ev.toElement.children[1].innerText);
}

/* Function that specifies what is supposed to happen to
an object that has been dragged and dropped */

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var author = ev.dataTransfer.getData("author");
    ev.target.value = author + " wrote: " + data;
}

/*---------- Client side Routing -------------------*/

/* Function that loads the profile page from a href */

page('/profile',function(){
	localStorage.setItem('prevMenuClick','profile-li');
	myProfile();
});

/* Function that loads the wall page from a href */

page('/wall', function(){
	localStorage.setItem('prevMenuClick','wall-li');
	wallClick();
});

/* Function that loads the search page from a href */

page('/search',function(){
	localStorage.setItem('prevMenuClick','search-li');
	searchClick();
})

/* Function that loads the about page from a href */

page('/about',function(){
	localStorage.setItem('prevMenuClick','about-li');
	aboutClick()
})

page.start();
