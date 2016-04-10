function createlink(link) {
	var name = peoplenames[link[0]];
	var colour = colours[link[1]];
	var image = images[link[2]];
	var nextpages = link[4];
	
	var container = document.createElement("div");
	
	if (nextpages.length == 0) {
		var personicon = document.createElement("img");
		personicon.src = chrome.extension.getURL("images/" + image);
		personicon.width = 32;
		personicon.height = 32;
		personicon.style["vertical-align"] = "middle";
		personicon.title = name;
		container.appendChild(personicon);
		
		var entercommand = document.createElement("span");
		entercommand.innerText = "> ";
		container.appendChild(entercommand);
		
		return container;
	}
	
	while (nextpages.length > 0) {
		var nextpage = nextpages.pop();
		var nextpageno = nextpage[0];
		var nextpageindex = nextpage[1];
		var nextpagecaption = name;
		if (nextpage.length == 4) {
			nextpagecaption = nextpagecaption + " - " + nextpage[2];
		}
		
		var innercontainer = document.createElement("div");
		
		var personicon = document.createElement("img");
		personicon.src = chrome.extension.getURL("images/" + image);
		personicon.width = 32;
		personicon.height = 32;
		personicon.style["vertical-align"] = "middle";
		personicon.title = nextpagecaption;
		innercontainer.appendChild(personicon);
		
		var entercommand = document.createElement("span");
		entercommand.innerText = "> ";
		innercontainer.appendChild(entercommand);
		
		var link = document.createElement("a");
		link.href = "/?s=6&p=" + zeropad(nextpageno);
		link.hash = nextpageindex;
		link.title = nextpagecaption;
		
		if ((document.location.pathname == "/trickster.php") && (names[nextpageno].indexOf("==>") != -1)) {
			// In trickster section, replace "==>" in page name with sucker image
			link.innerHTML = names[nextpageno].replace("==>", "");
			
			var sucker = document.createElement("img");
			sucker.src = "http://mspaintadventures.com/images/trickster_sitegraphics/sucker.gif";
			sucker.style.backgroundColor = colour;
			sucker.style.boxShadow = "0px 0px 2px 2px " + colour;
			
			link.appendChild(sucker);
		} else if (name.indexOf("English") != -1) {
			// Give Lord English, Jack English colourful links
			link.appendChild(lordenglishtext(names[nextpageno]));
		} else {
			link.innerText = names[nextpageno];
		}
		
		link.style.color = colour;
		innercontainer.appendChild(link);
		
		container.appendChild(innercontainer);
	}
	
	return container;
}

function zeropad(pageno) {
	return ("00" + pageno).slice(-6);
}

function modifypage() {
	if (document.location.pathname == "/DOTA/") {
		pageno = 6715;
	} else if (document.location.pathname == "/007395/") {
		pageno = 7395;
	} else if (document.location.pathname.substr(0, 8) == "/007680/") {
		pageno = 7680;
	} else if (document.location.pathname == "/GAMEOVER/") {
		pageno = 8801;
	} else if (document.location.pathname == "/shes8ack/") {
		pageno = 9305;
	} else if (document.location.pathname == "/collide.html") {
		pageno = 9987;
	} else {
		pageno = parseInt(document.location.search.slice(7));
	}
	
	if ((pageno > 7688) && (pageno < 7826)) {
		// Compensate for Act 6 Act 5 Act 1 x2 combo
		pageno -= pageno % 2;
	}
	
	// Try to find where to put the links
	a = document.querySelectorAll("font[size='5']");
	if (a.length > 0) {
		linkcontainer = a[a.length - 1];
	} else if (pageno == 9987) {
		// Collide uses a different size font tag
		linkcontainer = document.querySelector("font[size='6']");
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
	
	// Link to click on when right arrow button pressed
	nextpagelink = linkcontainer.getElementsByTagName("a")[0];
	
	// Find the element containing the image/flash, any pesterlogs, and all the links
	outercontainer = linkcontainer;
	while (outercontainer.parentElement && outercontainer.tagName != "CENTER") {
		outercontainer = outercontainer.parentElement;
	}
	
	chrome.storage.sync.get({timelinesenabled: {}, autoopenpesterlog: "no", arrownavigation: "no", docscratchtext: "no", disableletext: "no", preretcon: "no", flashcontrols: "no"}, function(items) {
		// Add links to page
		for (var i in timelines[pageno]) {
			var currentgroup = groups[timelines[pageno][i][3]];
			if (items.timelinesenabled[currentgroup] != false) {
				currentlink = createlink(timelines[pageno][i]);
				if ("#" + i == document.location.hash) {
					nextpagelink = currentlink.getElementsByTagName("a")[0];
				}
				linkcontainer.appendChild(currentlink);
			}
		}
		
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
					if (nextpagelink) {
						nextpagelink.click();
						return false;
					} else {
						return true;
					}
				} else if (e.keyCode == 37) {
					// Press left
					history.back();
					return false;
				}
				return true;
			};
		}
		
		// Style modifications
		document.body.appendChild(document.createElement("style"));
		sheet = document.styleSheets[document.styleSheets.length - 1];
		
		// Give background colour to text of Doc Scratch
		if (items.docscratchtext == "yes") {
			sheet.addRule('span[style$="FFFFFF"], span[style$="ffffff"], span[style$="white"]', 'background-color: #0E4603;');
		}
		
		// Give Lord English colourful links
		if (items.disableletext == "no") {
			lordenglishinit();
		}
		
		// View pre-retcon pages
		if (items.preretcon == "yes") {
			sheet.addRule('img.preretcon:hover', 'opacity: 0;');
			var currentimages = document.querySelectorAll("img[src*='retcon'");
			for (var i = 0; i < currentimages.length; i ++) {
				var doubleimagecontainer = document.createElement("div");
				doubleimagecontainer.style.display = "inline-block";
				doubleimagecontainer.style.position = "relative";
				currentimages[i].parentElement.insertBefore(doubleimagecontainer, currentimages[i]);
				doubleimagecontainer.appendChild(currentimages[i]);
				
				var preretconimg = document.createElement("img");
				preretconimg.src = currentimages[i].src.replace("_retcon", "").replace("retcon", "");
				preretconimg.style.position = "absolute";
				preretconimg.style.top = 0;
				preretconimg.style.left = 0;
				preretconimg.className = "preretcon";
				preretconimg.style.transition = "opacity 0.3s";
				
				doubleimagecontainer.appendChild(preretconimg);
			}
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

modifypage();