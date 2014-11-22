// Modified from the bookmarklet made by squarefree
// https://www.squarefree.com/bookmarklets/flash.html

// PercentLoaded
// IsPlaying
// Rewind
// GetVariable, SetVariable

flashlengths = {
	1931: -1, 1977: 544, 1982: 827, 1988: 391, 1990: -1, 2010: -1, 2037: 1201, 2038: -1, 2040: 130, 2077: 120, 2086: 173, 2122: 917, 2146: 1124,
	2150: 1074, 2151: 473, 2153: -1, 2207: 620, 2238: -1, 2288: -1, 2293: -1, 2297: -1, 2300: -1, 2318: 74, 2322: 511, 2323: 97, 2324: 699, 2344: 1126, 2376: -1, 2401: 179, 2544: 433, 2551: 680, 2565: 2011, 2621: 1071, 2655: 1049, 2657: 3859,
	2669: -1, 2672: -1, 2722: 1197, 2725: 289, 2726: 153, 2730: -1, 2733: 2151, 2736: 2102, 2743: 1117, 2771: 1575, 2779: 1616, 2818: -1, 2838: 1999, 2848: 1063, 2879: 645, 2880: 3034, 2926: 2658, 2970: 1784, 2973: 4943, 3049: 5510,
	3054: 179, 3167: 1633,
	
	6009: -1,
	6714: -1, 7395: 450, 7680: 78,
	8801: -1
};

function initFlashControls() {
	var x = document.embeds;
	if ((x.length > (document.location.pathname == "/trickster.php")) && (flashlengths[pageno] != -1)) {
		var flash = x[x.length - 1];
		addFlashControls(flash);
	}
}

function addFlashControls(flash) {
	// MSPA uses inconsistent subdomaining
	// Convert flash to appropriate subdomain
	var i = flash.src.indexOf("mspaintadventures.com") + 21;
	if ((i != 20) && (flash.src.substr(0, i) != document.location.origin)) {
		var tempflash = flash.cloneNode();
		tempflash.src = document.location.origin + flash.src.slice(i);
		flash.insertAdjacentElement("afterEnd", tempflash);
		flash.parentElement.removeChild(flash);
		flash = tempflash;
	}
	
	var controlsDiv = document.createElement("div");
	flash.insertAdjacentElement("afterEnd", controlsDiv);
	
	var table = document.createElement("table");
	table.width = "650px";
	controlsDiv.appendChild(table);
	
	var row = table.insertRow(-1);
	
	var pauseButton = document.createElement("button");
	pauseButton.innerText = "Pause";
	
	var buttonCell = row.insertCell(-1);
	buttonCell.appendChild(pauseButton);
	pauseButton.onclick = pauseUnpause;
	
	var sliderCell = row.insertCell(-1);
	sliderCell.style.width = "100%";
	var slider = document.createElement("input");
	slider.style.width = "100%";
	slider.type = "range";
	slider.min = 0;
	if (pageno in flashlengths) {
		slider.max = flashlengths[pageno];
	} else {
		slider.max = 0;	// Actually set during first run of update
	}
	slider.value = 0;
	sliderCell.appendChild(slider);
	var sliderWidth;
	var paused = false;
	var dragging = false;
	slider.oninput = function () { flash.GotoFrame(slider.value); };
	slider.onchange = function() {
		if (paused) {
			flash.StopPlay();
		} else {
			flash.Play();
		}
	};
	
	window.setInterval(update, 100);

	function pauseUnpause() {
		if (flash.Play) {
			paused = !paused;
			if (paused) {
				pauseButton.style.borderStyle = "inset";
				flash.StopPlay();
			} else {
				pauseButton.style.borderStyle = "";
				flash.Play();
			}
		}
	}

	function update() {
		if (flash.CurrentFrame) {
			if (flash.CurrentFrame() > slider.max) {
				// Not the most efficient of checks, but it works in a lot of edge cases
				slider.max = flash.TotalFrames();
			}
			slider.value = flash.CurrentFrame();
		}
	}
}