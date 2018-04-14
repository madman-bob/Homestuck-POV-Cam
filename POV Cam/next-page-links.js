function zeroPad(pageNo) {
    return ("00" + pageNo).slice(-6);
}

class LinkData {
    constructor(rawLinkData) {
        this.name = peoplenames[rawLinkData[0]];
        this.colour = colours[rawLinkData[1]];
        this.image = images[rawLinkData[2]];
        this.group = groups[rawLinkData[3]];
        this.nextPages = rawLinkData[4].map(rawNextPageData => new DestinationLink(rawNextPageData));
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

class DestinationLink {
    constructor(rawLinkData) {
        this.pageNo = rawLinkData[0];
        this.nextLinkIndex = rawLinkData[1];
    }

    get pageCaption() {
        return pageCaptions[languageCode][this.pageNo];
    }

    createLinkElement(caption) {
        var link = document.createElement("a");

        link.href = "/?s=6&p=" + zeroPad(this.pageNo);
        link.hash = this.nextLinkIndex;
        link.title = caption;

        return link;
    }
}

function createLink(linkData) {
    if (linkData.nextPages.length == 0) {
        return linkData.createCommandPrompt(linkData.name);
    }

    var container = document.createElement("div");

    while (linkData.nextPages.length > 0) {
        var destinationLink = linkData.nextPages.pop();
        var nextPageCaption = linkData.name;

        var innerContainer = linkData.createCommandPrompt(nextPageCaption);

        var link = destinationLink.createLinkElement(nextPageCaption);

        var originalSucker = document.querySelector("img[src*='sucker']");

        if (originalSucker && (destinationLink.pageCaption.indexOf("==>") != -1)) {
            // In trickster section, replace "==>" in page name with sucker image
            link.innerHTML = destinationLink.pageCaption.replace("==>", "");

            var sucker = document.createElement("img");
            sucker.src = originalSucker.src;
            sucker.style.backgroundColor = linkData.colour;
            sucker.style.boxShadow = "0px 0px 2px 2px " + linkData.colour;

            link.appendChild(sucker);
        } else if (linkData.name.indexOf("English") != -1) {
            // Give Lord English, Jack English colourful links
            link.appendChild(lordEnglishText(destinationLink.pageCaption));
        } else {
            link.innerText = destinationLink.pageCaption;
        }

        link.style.color = linkData.colour;
        innerContainer.appendChild(link);

        container.appendChild(innerContainer);
    }

    return container;
}
