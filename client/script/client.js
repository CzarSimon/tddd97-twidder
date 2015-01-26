$("#error-message-box").hide();

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


displayErrorMessage = function(message) {

}

signupClick = function() {
	var invalidMessage = null;

	if (document.getElementById("password-SU").value != document.getElementById("repeatPassword-SU")) {
		invalidMessage = "Not the same as password";
	}

	displayErrorMessage(invalidMessage)

}
