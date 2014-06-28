function getspecificnextpages(person, timelineindex) {
	var nextpages = [];
	
	timelineindex ++;
	while ((timelineindex < timelines[person].length) && (isNaN(timelines[person][timelineindex]))) {
		var timelinesplit = timelines[person][timelineindex].split("-");
		if (timelinesplit[0] in timelines) {
			if (timelinesplit.length == 2) {
				nextpages.push([timelinesplit[0], timelines[timelinesplit[0]].indexOf(parseInt(timelinesplit[1]))]);
			} else {
				nextpages.push([timelinesplit[0], 0]);
			}
		}
		timelineindex ++;
	}
	if ((timelineindex < timelines[person].length) && (timelines[person][timelineindex] != 0)) {
		nextpages.push([person, timelineindex]);
	}
	
	return nextpages;
}

function getallnextpages(person, pageno) {
	var timelineindex = timelines[person].indexOf(pageno);
	var nextpages = [];
	
	while (timelineindex != -1) {
		nextpages = getspecificnextpages(person, timelineindex).concat(nextpages);
		timelineindex = timelines[person].indexOf(pageno, timelineindex + 1);
	}
	
	return nextpages;
}

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

function whoson(pageno) {
	for (var person in timelines) {
		if (timelines[person].indexOf(pageno) != -1) {
			console.log(person);
		}
	}
}

timelines = {};

chrome.storage.sync.get({timelinesenabled: []}, function(items) {
	var timelinesenabled = items.timelinesenabled;

