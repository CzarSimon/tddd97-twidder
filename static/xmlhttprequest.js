var xmlHttpRequest = new Object();

xmlHttpRequest.sendPost = function(method, route, form, success, extraData) {
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
			success(JSON.parse(xmlhttp.responseText), extraData);
		}
	}
	return (xmlhttp.send(form))
}