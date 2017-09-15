// Modified from the bookmarklet made by squarefree
// https://www.squarefree.com/bookmarklets/flash.html

// PercentLoaded
// IsPlaying
// Rewind
// GetVariable, SetVariable

function initFlashControls() {
    var flashPanels = document.embeds;
    if (
        (flashPanels.length > (document.location.pathname == "/trickster.php" || document.location.pathname == "/index_hscrollb.php"))
        && (flashLengths[pageNo] != -1)
    ) {
        var flashPanel = flashPanels[flashPanels.length - 1];
        addFlashControls(flashPanel);
    }
}

function addFlashControls(flashPanel) {
    // MSPA uses inconsistent subdomaining
    // Convert flash to appropriate subdomain
    var i = flashPanel.src.indexOf("mspaintadventures.com") + 21;
    if ((i != 20) && (flashPanel.src.substr(0, i) != document.location.origin)) {
        var tempflash = flashPanel.cloneNode();
        tempflash.src = document.location.origin + flashPanel.src.slice(i);
        flashPanel.insertAdjacentElement("afterEnd", tempflash);
        flashPanel.parentElement.removeChild(flashPanel);
        flashPanel = tempflash;
    }

    var controlsDiv = document.createElement("div");
    flashPanel.insertAdjacentElement("afterEnd", controlsDiv);

    var table = document.createElement("table");
    table.width = "650px";
    controlsDiv.appendChild(table);

    var row = table.insertRow(-1);

    var pauseButton = document.createElement("button");
    pauseButton.innerText = "Pause";

    var buttonCell = row.insertCell(-1);
    buttonCell.appendChild(pauseButton);
    pauseButton.onclick = togglePause;

    var sliderCell = row.insertCell(-1);
    sliderCell.style.width = "100%";
    var slider = document.createElement("input");
    slider.style.width = "100%";
    slider.type = "range";
    slider.min = 0;
    if (pageNo in flashLengths) {
        slider.max = flashLengths[pageNo];
    } else {
        slider.max = 0;	// Actually set during first run of update
    }
    slider.value = 0;
    sliderCell.appendChild(slider);
    var sliderWidth;
    var paused = false;
    var dragging = false;
    slider.oninput = function () {
        if (slider.value == flashLengths[pageNo]) {
            flashPanel.GotoFrame(slider.value - 1);
        } else {
            flashPanel.GotoFrame(slider.value);
        }
    };
    slider.onchange = function () {
        if (paused) {
            flashPanel.StopPlay();
        } else {
            flashPanel.Play();
        }
    };

    window.setInterval(updateSliderValue, 33);

    function togglePause() {
        if (flashPanel.Play) {
            paused = !paused;
            if (paused) {
                pauseButton.style.borderStyle = "inset";
                flashPanel.StopPlay();
            } else {
                pauseButton.style.borderStyle = "";
                flashPanel.Play();
            }
        }
    }

    function updateSliderValue() {
        if (flashPanel.CurrentFrame) {
            if (flashPanel.CurrentFrame() > slider.max) {
                // Not the most efficient of checks, but it works in a lot of edge cases
                slider.max = flashPanel.TotalFrames();
            }
            slider.value = flashPanel.CurrentFrame();
        }
    }
}
