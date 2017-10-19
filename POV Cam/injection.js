function modifyPage() {
    pageNo = getPageNo();

    var linkContainer = getStandardNextPageLink();

    // Link to click on when right arrow button pressed
    var nextPageLink = linkContainer.getElementsByTagName("a")[0];

    var outerContainer = getOuterContainer(linkContainer);

    chrome.storage.sync.get({
        timelinesenabled: {},
        autoopenpesterlog: "no",
        arrownavigation: "no",
        docscratchtext: "no",
        disableletext: "no",
        preretcon: "no",
        flashcontrols: "no"
    }, function (items) {
        // Add links to page
        for (var i in timelines[pageNo]) {
            var linkData = new LinkData(timelines[pageNo][i]);
            if (items.timelinesenabled[linkData.group] != false) {
                var currentLink = createLink(linkData);
                if ("#" + i == document.location.hash) {
                    nextPageLink = currentLink.getElementsByTagName("a")[0];
                }
                linkContainer.appendChild(currentLink);
            }
        }

        // Auto-open pesterlog
        if (items.autoopenpesterlog == "yes") {
            // First button is "Show Pesterlog", second "Hide Pesterlog"
            // In Act 6 Act 5 Act 1 x2 combo, can have another pair of buttons
            var buttons = outerContainer.getElementsByTagName("button");
            for (var i = 0; i < buttons.length; i += 2) {
                buttons[i].click();
            }
        }

        // Use arrow keys to change page
        if (items.arrownavigation == "yes") {
            initArrowNavigation(nextPageLink);
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
            lordEnglishInit();
        }

        // View pre-retcon pages
        if (items.preretcon == "yes") {
            document.querySelectorAll("img[src*='retcon']").forEach(postRetconImage => {
                overlayPreRetconImage(postRetconImage);
            });
        }

        // Flash controls
        if (items.flashcontrols == "yes") {
            initFlashControls();
        }
    });

    // Add link to go to the options page
    var SOLinkContainer = getStartOverLinkContainer();

    if (SOLinkContainer) {
        var optionsLink = document.createElement("a");
        optionsLink.href = chrome.extension.getURL("options/options.html");
        optionsLink.innerText = "POV Cam Options";
        optionsLink.style["font-weight"] = "bold";
        optionsLink.style["font-size"] = "10px";
        optionsLink.style.display = "block";

        SOLinkContainer.parentElement.insertBefore(optionsLink, SOLinkContainer);
    }
}

modifyPage();
