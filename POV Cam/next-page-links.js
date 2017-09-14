function zeroPad(pageNo) {
    return ("00" + pageNo).slice(-6);
}

class LinkData {
    constructor(rawLinkData) {
        this.name = peoplenames[rawLinkData[0]];
        this.colour = colours[rawLinkData[1]];
        this.image = images[rawLinkData[2]];
        this.group = groups[rawLinkData[3]];
        this.nextPages = rawLinkData[4];
    }
}

function createLink(linkData) {
    var container = document.createElement("div");

    if (linkData.nextPages.length == 0) {
        var personIcon = document.createElement("img");
        personIcon.src = chrome.extension.getURL("images/" + linkData.image);
        personIcon.width = 32;
        personIcon.height = 32;
        personIcon.style["vertical-align"] = "middle";
        personIcon.title = linkData.name;
        container.appendChild(personIcon);

        var enterCommand = document.createElement("span");
        enterCommand.innerText = "> ";
        container.appendChild(enterCommand);

        return container;
    }

    while (linkData.nextPages.length > 0) {
        var nextPage = linkData.nextPages.pop();
        var nextPageNo = nextPage[0];
        var nextPageIndex = nextPage[1];
        var nextPageCaption = linkData.name;
        if (nextPage.length == 4) {
            nextPageCaption = nextPageCaption + " - " + nextPage[2];
        }

        var innerContainer = document.createElement("div");

        var personIcon = document.createElement("img");
        personIcon.src = chrome.extension.getURL("images/" + linkData.image);
        personIcon.width = 32;
        personIcon.height = 32;
        personIcon.style["vertical-align"] = "middle";
        personIcon.title = nextPageCaption;
        innerContainer.appendChild(personIcon);

        var enterCommand = document.createElement("span");
        enterCommand.innerText = "> ";
        innerContainer.appendChild(enterCommand);

        var link = document.createElement("a");
        link.href = "/?s=6&p=" + zeroPad(nextPageNo);
        link.hash = nextPageIndex;
        link.title = nextPageCaption;

        if ((document.location.pathname == "/trickster.php") && (pageCaptions[nextPageNo].indexOf("==>") != -1)) {
            // In trickster section, replace "==>" in page name with sucker image
            link.innerHTML = pageCaptions[nextPageNo].replace("==>", "");

            var sucker = document.createElement("img");
            sucker.src = "http://mspaintadventures.com/images/trickster_sitegraphics/sucker.gif";
            sucker.style.backgroundColor = linkData.colour;
            sucker.style.boxShadow = "0px 0px 2px 2px " + linkData.colour;

            link.appendChild(sucker);
        } else if (linkData.name.indexOf("English") != -1) {
            // Give Lord English, Jack English colourful links
            link.appendChild(lordEnglishText(pageCaptions[nextPageNo]));
        } else {
            link.innerText = pageCaptions[nextPageNo];
        }

        link.style.color = linkData.colour;
        innerContainer.appendChild(link);

        container.appendChild(innerContainer);
    }

    return container;
}
