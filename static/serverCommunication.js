var sendPost = function(method, route, form, callback) {
	var xmlhttp; 
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open(method, route, "true");
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			callback(JSON.parse(xmlhttp.responseText));
		}
	}
	return (xmlhttp.send(form))
}

signInServer = function(email, password) {
	var form = "email=" + email + "&password=" + password;
	sendPost('POST', 'sign-in', form, console.log.bind(console))
}


