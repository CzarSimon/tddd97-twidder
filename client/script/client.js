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
	checkSignUpForm();

}

function checkSignUpForm() {

	var formData = [];

	var error = 0;

	formData["firstname"] = document.getElementById("fname-SU").value;
	formData["familyname"] = document.getElementById("lname-SU").value;
	formData["gender"] = document.getElementById("gender-SU").value;
	formData["city"] = document.getElementById("city-SU").value;
	formData["country"] = document.getElementById("country-SU").value;
	formData["email"] = document.getElementById("email-SU").value;
	formData["password"] = document.getElementById("password-SU").value;
	
	/* Denna funkar inte, detta är ingen array (är det ett table? vem vet!)
	for(i=0; i<formData.length; i++) {
				alert(i)
                if (formData[i].value === "" ) {
                	alert(i)
                   	error = 1;
            }
    }
    if (error == 1) {
    	alert("Nått är ej ifyllt");
    }
    */
    alert(serverstub.signUp(formData)["message"]);
}
