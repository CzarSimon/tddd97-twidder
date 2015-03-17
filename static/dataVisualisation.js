/*
The funcution recives live data from websocket connections and displays it
in the hidden div's on the about page. Updates the about page if it is already open.
*/
function publishData(data) {
	console.log('in publish data');
	console.log(data);
	
	$('#logged-out-users').html(data.users - data.loggedIn);
	$('#posted-messages').html(data.messages);
	$('#signed-in-users').html(data.loggedIn);
	$('#my-messages').html(data.myMessages); 

	if (document.getElementById('hidden-content').style.display == 'block') {
		openAboutPage();
	}
}

/*
Displays the about page and displays the data that publishData() has put in the hidden div's on the about page.
The data is displayed in two pie charts.
*/
function openAboutPage(){
	$('#content').html('');
	document.getElementById('hidden-content').style.display = 'block'

	var memberPieData = 	[
								{
									value: $('#logged-out-users').html(),
									color:"#F7464A",
									highlight: "#FF5A5E",
									label: "Logged out users"
								},
								{
									value: $('#signed-in-users').html(),
									color: "#46BFBD",
									highlight: "#5AD3D1",
									label: "Logged in users"
								}
							]

	var messagePieData =	[
								{
									value: $('#posted-messages').html(),
									color: "#FDB45C",
									highlight: "#FFC870",
									label: "Messages on Twidder"
								},
								{
									value: $('#my-messages').html(),
									color: "#949FB1",
									highlight: "#A8B3C5",
									label: "Messages on your wall"	
								}
							]
	console.log(messagePieData)
	console.log(memberPieData)					
	var messageChart = document.getElementById("message-chart").getContext("2d");
	messagePie = new Chart(messageChart).Pie(messagePieData, {});

	var memberChart = document.getElementById("member-chart").getContext("2d");
	memberPie = new Chart(memberChart).Pie(memberPieData, {});

}