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

    createIcon(caption) {
        var icon = document.createElement("img");
        icon.src = chrome.extension.getURL("images/" + this.image);
        icon.width = 32;
        icon.height = 32;
        icon.style["vertical-align"] = "middle";
        icon.title = caption;

        return icon;
    }

    static createAnonCommandPrompt() {
        var commandPrompt = document.createElement("span");
        commandPrompt.innerText = "> ";
        return commandPrompt;
    }

    createCommandPrompt(caption) {
        var container = document.createElement("div");

        container.appendChild(this.createIcon(caption));
        container.appendChild(LinkData.createAnonCommandPrompt());

        return container;
    }
}

function createLink(linkData) {
    if (linkData.nextPages.length == 0) {
        return linkData.createCommandPrompt(linkData.name);
    }

    var container = document.createElement("div");

    while (linkData.nextPages.length > 0) {
        var nextPage = linkData.nextPages.pop();
        var nextPageNo = nextPage[0];
        var nextPageIndex = nextPage[1];
        var nextPageCaption = linkData.name;

        var innerContainer = linkData.createCommandPrompt(nextPageCaption);

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
