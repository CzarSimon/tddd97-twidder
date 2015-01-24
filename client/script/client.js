displayView = function(currentView){	
	window.alert(currentView);	
	$('body').append("<h1>" + currentView + "</h1>")
}

window.onload = function(){
	var view = '#feedView';

	localStorage.setItem('loggedinusers', 'Simon');

	if (localStorage.getItem("loggedinusers") == null) {
		view = "#welcomeview"
	} else {
		view = localStorage.getItem('loggedinusers');
	} 

	displayView(view);

}
