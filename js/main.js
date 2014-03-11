var cityID;
var city;

$(document).ready(function() {

	$("#intro").click(function() {
		$(this).fadeOut(400, function() {
			$("iframe").fadeIn(600);
			historyAppend();
		});
		
	});
	$("input[name='city']").mouseenter(function() {
		$(this).focus();
		$(this).css({
			color: "#fff"
		});
	});

	$(document).keypress(function(e) {
		if(e.which == 13) {
			cityInput();
		}
	});

	$("#footer").mouseleave(function() {
		var cityValue = $("input[name='city']").val();
		if(cityValue !== "" && cityValue !== city) {
			cityInput();
		} 		
		$("input[name='city']").blur();
	});
});

function storeCity(data) {
	$.each(data, function(index, startup) {
		if(startup.type === "LocationTag") {
			cityID = data[index].id;
			console.log("The current city's name is " + data[index].name);
    		console.log("The current city's id is " + data[0].id);
			break;
		}
	});

}

function getCityList() {
	sites = [];
	$.ajax({
		     type : "GET",
		     dataType : "jsonp",
		     url : "https://api.angel.co/1/tags/" + cityID + "/startups",
		     data: { order: "popularity" },
		     success: function(data){
		     	   $("input[name='city']").css({
		     	   	   color: "#428bca"
		     	   });
		           $.each(data['startups'], function(index, startup) {
		           		if(startup.hidden === false) {
		           			console.log(startup.name);
		           			console.log(startup.company_url);
		           			sites.push(startup.company_url);
		           			sites = $.unique(sites);
		           		}
		           });
		     }
		});
}

function cityInput() {
		city = $("input[name='city']").val();
		$.ajax({
		     type : "POST",
		     dataType : "jsonp",
		     url : "https://api.angel.co/1/search", // ?callback=?
		     data: { query: city, User: "LocationTag"},
		     success: function(data){
		           // do stuff with data
		           storeCity(data);
		           getCityList();
		           console.log(data);
		     }
		});
}

function historyAppend() {
	var parser = document.createElement('a');
	parser.href = $("iframe").attr("src");
	history.pushState(null, null, parser.hostname);
	_gaq.push(['_trackPageview', '/' + parser.hostname]);
}