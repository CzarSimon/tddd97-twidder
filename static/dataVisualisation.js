function publishData(data) {
	console.log('in publish data');
	console.log(data);
	
	$('#signed-up-members').html(data.users);
	$('#posted-messages').html(data.messages);
	$('#signed-in-users').html(data.loggedIn);
	$('#my-messages').html(data.myMessages); 
	
	if (document.getElementById('hidden-content').style.display == 'block') {
		openAboutPage();
	}
}

function openAboutPage(){
	$('#content').html('');
	document.getElementById('hidden-content').style.display = 'block'

	var memberPieData = 	[
								{
									value: $('#signed-up-members').html(),
									color:"#F7464A",
									highlight: "#FF5A5E",
									label: "Red"
								},
								{
									value: $('#signed-in-users').html(),
									color: "#46BFBD",
									highlight: "#5AD3D1",
									label: "Green"
								}
							]

	var messagePieData =	[
								{
									value: $('#posted-messages').html(),
									color: "#FDB45C",
									highlight: "#FFC870",
									label: "Yellow"
								},
								{
									value: $('#my-messages').html(),
									color: "#949FB1",
									highlight: "#A8B3C5",
									label: "Grey"	
								}
							]
	console.log(messagePieData)
	console.log(memberPieData)					
	var messageChart = document.getElementById("message-chart").getContext("2d");
	messagePie = new Chart(messageChart).Pie(messagePieData, {});

	var memberChart = document.getElementById("member-chart").getContext("2d");
	memberPie = new Chart(memberChart).Pie(memberPieData, {});

}