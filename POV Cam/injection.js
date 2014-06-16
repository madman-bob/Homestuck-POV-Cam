/*
Checks before release:
==> Update version number
==> Reactivate link removal when following
*/

function createlink(person, pageindex) {
	var container = document.createElement("div");
	
	var nextpages = [];
	
	var nextpageindex = timelines[person].indexOf(pageno, pageindex) + 1;
	while ((nextpageindex < timelines[person].length) && (isNaN(timelines[person][nextpageindex]))) {
		var timelinesplit = timelines[person][nextpageindex].split("-");
		if (timelinesplit[0] in timelines) {
			if (timelinesplit.length == 2) {
				console.log(timelines[timelinesplit[0]].indexOf(timelinesplit[1]));
				nextpages.push([timelinesplit[0], timelines[timelinesplit[0]].indexOf(parseInt(timelinesplit[1]))]);
			} else {
				nextpages.push([timelinesplit[0], 0]);
			}
		}
		nextpageindex ++;
	}
	if ((nextpageindex < timelines[person].length) && (timelines[person][nextpageindex] != 0)) {
		nextpages.push([person, nextpageindex]);
	}
	
	if (nextpages.length == 0) {
		container.innerText = "> No more";
		return container;
	}
	
	while (nextpages.length > 0) {
		var nextpage = nextpages.pop();
		var nextpageno = timelines[nextpage[0]][nextpage[1]];
		
		// Put icons before >?
		// chrome.extension.getURL("images/blah.png")
		
		var innercontainer = document.createElement("div");
		var entercommand = document.createElement("span");
		entercommand.innerText = "> ";
		innercontainer.appendChild(entercommand);
		
		var link = document.createElement("a");
		link.href = "/?s=6&p=" + zeropad(nextpageno);
		link.hash = nextpage[0] + "-" + nextpage[1];
		
		// In trickster section, replace "==>" in page name with sucker image
		if ((document.location.pathname == "/trickster.php") && (names[nextpageno].indexOf("==&gt;") != -1)) {
			link.innerHTML = names[nextpageno].replace("==&gt;", "");
			
			var sucker = document.createElement("img");
			sucker.src = "http://mspaintadventures.com/images/trickster_sitegraphics/sucker.gif";
			
			if (colours[nextpage[0]]) {
				sucker.style.backgroundColor = colours[nextpage[0]];
				sucker.style.boxShadow = "0px 0px 2px 2px " + colours[nextpage[0]];
			}
			
			link.appendChild(sucker);
		} else {
			link.innerHTML = names[nextpageno];
		}
		
		if (colours[nextpage[0]]) {
			link.style.color = colours[nextpage[0]];
		}
		
		innercontainer.appendChild(link);
		container.appendChild(innercontainer);
	}
	
	return container;
}

function zeropad(pageno) {
	return ("00" + pageno).slice(-6);
}

function modifypage() {
	following = window.location.hash.substr(1).split("-");
	pageno = parseInt(document.location.search.slice(7));
	if ((pageno > 7688) && (pageno < 7826)) {
		// Compensate for Act 6 Act 5 Act 1 x2 combo
		pageno -= pageno % 2;
	}

	// Modify page links

	a = document.querySelectorAll("font[size='5']");
	if (a.length > 0) {
		linkcontainer = a[a.length - 1];
	} else {
		// Can't find next page link
		// Try to create one in right place
		linkcontainer = document.createElement("font");
		// Where to put it?
	}

	if (following.length == 1) {
		for (var person in timelines) {
			var pageindex = timelines[person].indexOf(pageno);
			if (pageindex != - 1) {
				linkcontainer.appendChild(createlink(person, pageindex));
			}
		}
	} else if (following[0] in timelines) {
		linkcontainer.innerHTML = "";
		linkcontainer.appendChild(createlink(following[0], parseInt(following[1])));
	}

	chrome.storage.sync.get({autoopenpesterlog: "no", arrownavigation: "no", docscratchtext: "no", flashcontrols: "no"}, function(items) {
		// Auto-open pesterlog
		if (items.autoopenpesterlog == "yes") {
			buttons = document.getElementsByTagName("button");
			if (document.location.pathname == "/ACT6ACT5ACT1x2COMBO.php") {
				if (buttons.length > 4) {
					buttons[0].click();
				}
				if (buttons.length > 6) {
					buttons[2].click();
				}
			} else {
				if (buttons.length > 2) {
					buttons[0].click();
				}
			}
		}
		
		// Use arrow keys to change page
		if (items.arrownavigation == "yes") {
			document.onkeydown = function(e) {
				if (e.keyCode == 39) {
					// Press right
					linkcontainer.getElementsByTagName("a")[0].click();
					return false;
				} else if (e.keyCode == 37) {
					// Press left
					history.back();
					return false;
				}
				return true;
			};
		}
		
		// Style modifications
		sheet = document.styleSheets[0];
		
		// Give background colour to text of Doc Scratch
		if (items.docscratchtext == "yes") {
			sheet.addRule('span[style$="FFFFFF"], span[style$="ffffff"], span[style$="white"]', 'background-color: #0E4603;');
		}
		
		// Flash controls
		if (items.flashcontrols == "yes") {
			initFlashControls();
		}
	});
}