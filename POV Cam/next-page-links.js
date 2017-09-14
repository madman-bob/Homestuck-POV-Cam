function zeroPad(pageNo) {
    return ("00" + pageNo).slice(-6);
}

function createLink(link) {
    var name = peoplenames[link[0]];
    var colour = colours[link[1]];
    var image = images[link[2]];
    var nextPages = link[4];

    var container = document.createElement("div");

    if (nextPages.length == 0) {
        var personIcon = document.createElement("img");
        personIcon.src = chrome.extension.getURL("images/" + image);
        personIcon.width = 32;
        personIcon.height = 32;
        personIcon.style["vertical-align"] = "middle";
        personIcon.title = name;
        container.appendChild(personIcon);

        var enterCommand = document.createElement("span");
        enterCommand.innerText = "> ";
        container.appendChild(enterCommand);

        return container;
    }

    while (nextPages.length > 0) {
        var nextPage = nextPages.pop();
        var nextPageNo = nextPage[0];
        var nextPageIndex = nextPage[1];
        var nextPageCaption = name;
        if (nextPage.length == 4) {
            nextPageCaption = nextPageCaption + " - " + nextPage[2];
        }

        var innerContainer = document.createElement("div");

        var personIcon = document.createElement("img");
        personIcon.src = chrome.extension.getURL("images/" + image);
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
            sucker.style.backgroundColor = colour;
            sucker.style.boxShadow = "0px 0px 2px 2px " + colour;

            link.appendChild(sucker);
        } else if (name.indexOf("English") != -1) {
            // Give Lord English, Jack English colourful links
            link.appendChild(lordEnglishText(pageCaptions[nextPageNo]));
        } else {
            link.innerText = pageCaptions[nextPageNo];
        }

        link.style.color = colour;
        innerContainer.appendChild(link);

        container.appendChild(innerContainer);
    }

    return container;
}
