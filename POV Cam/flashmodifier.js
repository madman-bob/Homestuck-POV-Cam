// Modified from the bookmarklet made by squarefree
// https://www.squarefree.com/bookmarklets/flash.html

// PercentLoaded
// IsPlaying
// Rewind
// GetVariable, SetVariable

function initFlashControls() {
	var x = document.embeds;
	if (x.length > (document.location.pathname == "/trickster.php")) {
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
	slider.max = 0;	// Actually set during first run of update
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