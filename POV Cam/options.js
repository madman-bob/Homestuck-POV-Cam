function getradiooptions(optionname) {
	var values = {}
	values[optionname] = "no";
	chrome.storage.sync.get(values, function(items) {
		document.querySelector("input[name='" + optionname + "'][value='" + items[optionname] + "']").checked = true;
	});
}

function saveoptions(e) {
	var values = {};
	values[e.target.name] = e.target.value;
	chrome.storage.sync.set(values, function() {});
}

var timelineoptions = {};

function gettimelineoptions() {
	var values = {timelinesenabled: timelineoptions};
	chrome.storage.sync.get(values, function(items) {
		timelineoptions = items.timelinesenabled;
		for (group in items.timelinesenabled) {
			document.getElementById(group).checked = items.timelinesenabled[group];
		}
	});
}

function savetimelineoptions(e) {
	timelineoptions[e.target.id] = e.target.checked;
	var values = {timelinesenabled: timelineoptions};
	chrome.storage.sync.set(values, function() {});
}

window.onload = function () {
	var radios = document.querySelectorAll("input[type='radio']");
	var previousradioname = "";
	for (var i = 0; i < radios.length; i ++) {
		radios[i].onchange = saveoptions;
		if (previousradioname != radios[i].name) {
			previousradioname = radios[i].name;
			getradiooptions(radios[i].name);
		}
	}
	
	var t = document.getElementById("timelinespanel");
	for (var group in groups) {
		timelineoptions[group] = true;
		var container = document.createElement("div");
		var tcheckbox = document.createElement("input");
		tcheckbox.type = "checkbox";
		tcheckbox.id = group;
		tcheckbox.onchange = savetimelineoptions;
		container.appendChild(tcheckbox);
		
		var tlabel = document.createElement("label");
		tlabel.innerText = group;
		tlabel.htmlFor = group;
		container.appendChild(tlabel);
		
		t.appendChild(container);
	}
	gettimelineoptions();
	
	timelinesenableall.onclick = function() {
		var checkboxes = t.querySelectorAll("[type='checkbox']");
		for (var i in checkboxes) {
			checkboxes[i].checked = false;
			checkboxes[i].click();
		}
	};
	
	timelinesdisableall.onclick = function() {
		var checkboxes = t.querySelectorAll("[type='checkbox']");
		for (var i in checkboxes) {
			checkboxes[i].checked = true;
			checkboxes[i].click();
		}
	};
	
	timelinesflipall.onclick = function() {
		var checkboxes = t.querySelectorAll("[type='checkbox']");
		for (var i in checkboxes) {
			checkboxes[i].click();
		}
	};
};