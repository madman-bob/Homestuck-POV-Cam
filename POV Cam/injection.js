function modifyPage() {
    if (document.location.pathname == "/DOTA/") {
        pageNo = 6715;
    } else if (document.location.pathname == "/007395/") {
        pageNo = 7395;
    } else if (document.location.pathname.substr(0, 8) == "/007680/") {
        pageNo = 7680;
    } else if (document.location.pathname == "/GAMEOVER/") {
        pageNo = 8801;
    } else if (document.location.pathname == "/shes8ack/") {
        pageNo = 9305;
    } else if (document.location.pathname == "/collide.html") {
        pageNo = 9987;
    } else if (document.location.pathname == "/ACT7.html") {
        pageNo = 10027;
    } else {
        pageNo = parseInt(document.location.search.slice(7));
    }

    if ((pageNo > 7688) && (pageNo < 7826)) {
        // Compensate for Act 6 Act 5 Act 1 x2 combo
        pageNo -= pageNo % 2;
    }

    // Try to find where to put the links
    var a = document.querySelectorAll("font[size='5']");
    var linkContainer;
    if (a.length > 0) {
        linkContainer = a[a.length - 1];
    } else if (pageNo == 9987) {
        // Collide uses a different size font tag
        linkContainer = document.querySelector("font[size='6']");
    } else if (pageNo == 10027) {
        // ACT 7 also uses a different size font tag
        linkContainer = document.querySelector("font[size='8']");
    } else {
        // Can't find next page link
        // Try to create one in right place
        linkContainer = document.createElement("font");
        linkContainer.size = "5";

        // Try to find "Save Game" menu
        var saveGameMenu = document.querySelector("span[style='font-size: 10px;']");
        if (saveGameMenu) {
            // If we've found it, then the link container is normally the first child of it's parent
            var linkLocation = saveGameMenu.parentNode;
            linkLocation.insertBefore(linkContainer, linkLocation.firstElementChild);
        } else {
            // Still not found it. Just add it to the end of the body
            document.body.appendChild(linkContainer);

            // Add some formatting to try and make it look right
            linkContainer.style.display = "block";
            linkContainer.style.width = 600;
            linkContainer.style.margin = "auto";
            linkContainer.style["margin-top"] = 20;
            linkContainer.style["font-family"] = "Verdana, Arial, Helvetica, sans-serif";
        }
    }

    // Link to click on when right arrow button pressed
    var nextPageLink = linkContainer.getElementsByTagName("a")[0];

    // Find the element containing the image/flash, any pesterlogs, and all the links
    var outerContainer = linkContainer;
    while (outerContainer.parentElement && outerContainer.tagName != "CENTER") {
        outerContainer = outerContainer.parentElement;
    }

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
            var currentgroup = groups[timelines[pageNo][i][3]];
            if (items.timelinesenabled[currentgroup] != false) {
                currentlink = createLink(timelines[pageNo][i]);
                if ("#" + i == document.location.hash) {
                    nextPageLink = currentlink.getElementsByTagName("a")[0];
                }
                linkContainer.appendChild(currentlink);
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
    // sogb = Start Over | Go Back
    var sogb = outerContainer.querySelector("a[href='?s=6']");
    if (sogb) {
        sogb = sogb.parentElement.parentElement;
        var optionsLink = document.createElement("a");
        optionsLink.href = chrome.extension.getURL("options/options.html");
        optionsLink.innerText = "POV Cam Options";
        optionsLink.style["font-weight"] = "bold";
        optionsLink.style["font-size"] = "10px";
        optionsLink.style.display = "block";

        sogb.parentElement.insertBefore(optionsLink, sogb);
    }
}

modifyPage();
