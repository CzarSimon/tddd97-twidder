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

signupClick = function() {
	var errorMessage = "nothing";
	var password = document.getElementById("password-SU").value;

	console.log(password);
	if (password.length < 5) {
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

