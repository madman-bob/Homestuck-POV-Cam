function lordEnglishInit() {
    var LEColourOrder = [[0, 2], [1, 3], [2, 0], [3, 1], [4, 6], [5, 0], [6, 4], [0, 2], [1, 3], [2, 0], [3, 1], [4, 6], [0, 5], [6, 4]];
    var LEColours = ["#FFEA00", "#4040FD", "#DF0000", "#A357FF", "#FF6000", "#008140", "#950015", "#000000"];
    var sheet = document.styleSheets[0];
    for (var i = 0; i < 14; i++) {
        sheet.addRule("@-webkit-keyframes le" + i, "0% {color:" + LEColours[LEColourOrder[i][0]] + ";} 49% {color:" + LEColours[LEColourOrder[i][0]] + ";} 50% {color:" + LEColours[LEColourOrder[i][1]] + ";} 100% {color:" + LEColours[LEColourOrder[i][1]] + ";}");
        sheet.addRule("letter.lordenglish:nth-of-type(14n + " + (i + 1) + ")", "-webkit-animation: le" + i + " 0.2s infinite;");
    }
    sheet.addRule("@-webkit-keyframes le", "0% {text-shadow:1px 1px #0AFF48;} 49% {text-shadow:1px 1px #0AFF48;} 50% {text-shadow:1px 1px #08C036;} 100% {text-shadow:1px 1px #08C036;}");
    sheet.addRule("span.lordenglishcontainer", "-webkit-animation: le 0.2s infinite;");
    sheet.addRule("span.lordenglishcontainer", "color:#000000;");
}

function lordEnglishText(text) {
    var container = document.createElement("span");
    container.classList.add("lordenglishcontainer");

    text = text.toUpperCase();
    var findingLE = ((text.indexOf("L") != -1) && (text.indexOf("E", text.indexOf("L")) != -1));
    var foundL = false;
    var foundE = false;
    for (var i in text) {
        var letterContainer;
        if (findingLE && (text[i] == "L") && (!foundL)) {
            foundL = true;
            letterContainer = document.createElement("span");
        } else if (findingLE && foundL && (text[i] == "E") && (!foundE)) {
            foundE = true;
            letterContainer = document.createElement("span");
        } else if (text[i] == " ") {
            letterContainer = document.createElement("span");
        } else {
            letterContainer = document.createElement("letter");
            letterContainer.classList.add("lordenglish");
        }
        letterContainer.innerText = text[i];
        container.appendChild(letterContainer);
    }

    return container;
}
