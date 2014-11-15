function createlink(nextpages) {
	var container = document.createElement("div");
	
	if (nextpages.length == 0) {
		return container;
	}
	
	while (nextpages.length > 0) {
		var nextpage = nextpages.pop();
		var nextpageno = timelines[nextpage[0]][nextpage[1]];
		
		var innercontainer = document.createElement("div");
		
		var personicon = document.createElement("img");
		personicon.src = chrome.extension.getURL("images/" + nextpage[0] +".png");
		personicon.width = 32;
		personicon.height = 32;
		personicon.style["vertical-align"] = "middle";
		innercontainer.appendChild(personicon);
		
		var entercommand = document.createElement("span");
		entercommand.innerText = "> ";
		innercontainer.appendChild(entercommand);
		
		var link = document.createElement("a");
		link.href = "/?s=6&p=" + zeropad(nextpageno);
		link.hash = nextpage[0] + "-" + nextpage[1];
		
		if ((document.location.pathname == "/trickster.php") && (names[nextpageno].indexOf("==>") != -1)) {
			// In trickster section, replace "==>" in page name with sucker image
			link.innerHTML = names[nextpageno].replace("==>", "");
			
			var sucker = document.createElement("img");
			sucker.src = "http://mspaintadventures.com/images/trickster_sitegraphics/sucker.gif";
			
			if (colours[nextpage[0]]) {
				sucker.style.backgroundColor = colours[nextpage[0]];
				sucker.style.boxShadow = "0px 0px 2px 2px " + colours[nextpage[0]];
			}
			
			link.appendChild(sucker);
		} else if (nextpage[0] == "lordenglish") {
			// Give Lord English colourful links
			link.appendChild(lordenglishtext(names[nextpageno]));
		} else {
			link.innerText = names[nextpageno];
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
	
	if (document.location.pathname == "/DOTA/") {
		pageno = 6715;
	} else if (document.location.pathname == "/007395/") {
		pageno = 7395;
	} else if (document.location.pathname.substr(0, 8) == "/007680/") {
		pageno = 7680;
	} else if (document.location.pathname == "/GAMEOVER/") {
		pageno = 8801;
	} else {
		pageno = parseInt(document.location.search.slice(7));
	}
	
	
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
		linkcontainer.size = "5";
		
		// Try to find "Save Game" menu
		var savegamemenu = document.querySelector("span[style='font-size: 10px;']");
		if (savegamemenu) {
			// If we've found it, then the link container is normally the first child of it's parent
			var linklocation = savegamemenu.parentNode;
			linklocation.insertBefore(linkcontainer, linklocation.firstElementChild);
		} else {
			// Still not found it. Just add it to the end of the body
			document.body.appendChild(linkcontainer);
			
			// Add some formatting to try and make it look right
			linkcontainer.style.display = "block";
			linkcontainer.style.width = 600;
			linkcontainer.style.margin = "auto";
			linkcontainer.style["margin-top"] = 20;
			linkcontainer.style["font-family"] = "Verdana, Arial, Helvetica, sans-serif";
		}
	}
	
	// Find the element containing the image/flash, any pesterlogs, and all the links
	outercontainer = linkcontainer;
	while (outercontainer.parentElement && outercontainer.tagName != "CENTER") {
		outercontainer = outercontainer.parentElement;
	}
	
	if (following.length == 1) {
		for (var person in timelines) {
			if (timelines[person].indexOf(pageno) != - 1) {
				linkcontainer.appendChild(createlink(getallnextpages(person, pageno)));
			}
		}
	} else if (following[0] in timelines) {
		linkcontainer.innerHTML = "";
		linkcontainer.appendChild(createlink(getspecificnextpages(following[0], parseInt(following[1]))));
	}

	chrome.storage.sync.get({autoopenpesterlog: "no", arrownavigation: "no", docscratchtext: "no", disableletext: "no", flashcontrols: "no"}, function(items) {
		// Auto-open pesterlog
		if (items.autoopenpesterlog == "yes") {
			buttons = outercontainer.getElementsByTagName("button");
			for (var i = 0; i < buttons.length; i += 2) {
				buttons[i].click();
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
		
		// Give Lord English colourful links
		if (items.disableletext == "no") {
			lordenglishinit();
		}
		
		// Flash controls
		if (items.flashcontrols == "yes") {
			initFlashControls();
		}
	});
	
	// Add link to go to the options page
	// sogb = Start Over | Go Back
	var sogb = outercontainer.querySelector("a[href='?s=6']");
	if (sogb) {
		sogb = sogb.parentElement.parentElement;
		var optionslink = document.createElement("a");
		optionslink.href = chrome.extension.getURL("options.html");
		optionslink.innerText = "POV Cam Options";
		optionslink.style["font-weight"] = "bold";
		optionslink.style["font-size"] = "10px";
		optionslink.style.display = "block";
		
		sogb.parentElement.insertBefore(optionslink, sogb);
	}
}