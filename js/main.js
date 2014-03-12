var cityID;
var city;

$(document).ready(function() {
	window.addEventListener("popstate", function(e) {
		var frame = $("iframe");
		var link = location.pathname.split('/')[2];
		frame.fadeOut(600, function() {
			Pace.restart();
			$(this).attr("src", "http://" + link);
		});
		frame.load(function() {
			frame.fadeIn(500, function() {
				Pace.stop();
				$("body").removeClass('pace-running');
			});
			_gaq.push(['_trackPageview', "/" + hostname]);
	document.title = "Uncovered Discovery Engine | " + hostname;
		});
	});

	$("input[name='city']").mouseenter(function() {
		$(this).focus();
		$(this).css({
			color: "#fff"
		});
	});

	$(document).keypress(function(e) {
		if (e.which == 13) {
			cityInput();
		}
	});

	$("#footer").mouseleave(function() {
		var cityValue = $("input[name='city']").val();
		if (cityValue !== "" && cityValue !== city) {
			cityInput();
		}
		$("input[name='city']").blur();
	});
});

function storeCity(data, index) {
	cityID = data[index].id;
}

function getCityList() {
	sites = [];
	$.ajax({
		type: "GET",
		dataType: "jsonp",
		url: "https://api.angel.co/1/tags/" + cityID + "/startups",
		data: {
			order: "popularity"
		},
		success: function(data) {
			$("input[name='city']").css({
				color: "#428bca"
			});
			$.each(data['startups'], function(index, startup) {
				if (startup.hidden === false && startup.company_url) {
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
		type: "POST",
		dataType: "jsonp",
		url: "https://api.angel.co/1/search", // ?callback=?
		data: {
			query: city,
			User: "LocationTag"
		},
		success: function(data) {
			// do stuff with data
			console.log(data);
			$.each(data, function(index, startup) {
				if (startup.type === "LocationTag") {
					storeCity(data, index);
					getCityList();
					console.log("The current city's name is " + data[index].name);
					console.log("The current city's id is " + data[0].id);
					return false;
				}
			});
		}
	});
}

function historyAppend() {
	var parser = document.createElement('a');
	parser.href = $("iframe").attr("src");
	var hostname = parser.hostname;
	history.pushState(null, null, hostname);
	_gaq.push(['_trackPageview', "/" + hostname]);
	document.title = "Uncovered Discovery Engine | " + hostname;
}