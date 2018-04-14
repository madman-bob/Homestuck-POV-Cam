isHomestuckDomain = document.location.hostname.indexOf("homestuck") != -1;

function getPageNo() {
    var pageNo;

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
        if (isHomestuckDomain) {
            pageNo = parseInt(document.location.pathname.slice(7) || "1") + 1900;
        } else {
            pageNo = parseInt(document.location.search.slice(7));
        }
    }

    if ((pageNo > 7688) && (pageNo < 7826)) {
        // Compensate for Act 6 Act 5 Act 1 x2 combo
        pageNo -= pageNo % 2;
    }

    return pageNo;
}

function getOuterContainer(elem) {
    // Find the element containing the image/flash, any pesterlogs, and all the links
    var outerContainer = elem;
    while (outerContainer.parentElement && outerContainer.tagName != "CENTER") {
        outerContainer = outerContainer.parentElement;
    }
    return outerContainer;
}

function getStandardNextPageLink() {
    // Try to find where to put the links
    var linkContainer = document.querySelector("font > a[href*='?s=6&p='], a[href*='/story']").parentElement;

    if (linkContainer) {
        return linkContainer;
    }

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

    return linkContainer;
}

function getStartOverLinkContainer() {
    var SOLink = document.querySelector("a[href$='?s=6'], #o_start-over");
    if (SOLink) {
        SOLink = SOLink.parentElement.parentElement;

        return SOLink;
    }
}
