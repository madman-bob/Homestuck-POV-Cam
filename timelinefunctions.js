function outputreadabletimelinedata(person) {
	var previousstart = "";
	var longstring = "Timeline data for " + person + ":";
	for (var i = 0; i < timelines[person].length + 1; i ++) {
		if (timelines[person][i - 1] != timelines[person][i] - 1) {
			if (timelines[person][i - 1] == previousstart) {
				longstring += "\n" + previousstart;
			} else if (previousstart != "") {
				longstring += "\n" + previousstart + "-" + timelines[person][i - 1];
			}
			previousstart = timelines[person][i];
		}
	}
	console.log(longstring);
}

function whoson(page) {
	for (var person in timelines) {
		if (timelines[person].indexOf(page) != -1) {
			console.log(person);
		}
	}
}

timelines = {};

chrome.storage.sync.get({timelinesenabled: []}, function(items) {
	var timelinesenabled = items.timelinesenabled;

