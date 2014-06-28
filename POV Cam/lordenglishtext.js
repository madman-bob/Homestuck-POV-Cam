function lordenglishinit() {
	var lecolourorder = [[0, 2], [1, 3], [2, 0], [3, 1], [4, 6], [5, 0], [6, 4], [0, 2], [1, 3], [2, 0], [3, 1], [4, 6], [0, 5], [6, 4]];
	var lecolours = ["#FFEA00", "#4040FD", "#DF0000", "#A357FF", "#FF6000", "#008140", "#950015", "#000000"];
	var sheet = document.styleSheets[0];
	for (var i = 0; i < 14; i ++) {
		sheet.addRule("@-webkit-keyframes le" + i, "0% {color:" + lecolours[lecolourorder[i][0]] + ";} 49% {color:" + lecolours[lecolourorder[i][0]] + ";} 50% {color:" + lecolours[lecolourorder[i][1]] + ";} 100% {color:" + lecolours[lecolourorder[i][1]] + ";}");
		sheet.addRule("letter.lordenglish:nth-of-type(14n + " + (i + 1) + ")", "-webkit-animation: le" + i + " 0.2s infinite;");
	}
	sheet.addRule("@-webkit-keyframes le", "0% {text-shadow:1px 1px #0AFF48;} 49% {text-shadow:1px 1px #0AFF48;} 50% {text-shadow:1px 1px #08C036;} 100% {text-shadow:1px 1px #08C036;}");
	sheet.addRule("span.lordenglishcontainer", "-webkit-animation: le 0.2s infinite;");
	sheet.addRule("span.lordenglishcontainer", "color:#000000;");
}

function lordenglishtext(t) {
	var container = document.createElement("span");
	container.classList.add("lordenglishcontainer");
	
	t = t.toUpperCase();
	var findingle = ((t.indexOf("L") != -1) && (t.indexOf("E", t.indexOf("L")) != -1));
	foundl = false;
	founde = false;
	for (var i in t) {
		var lettercontainer;
		if (findingle && (t[i] == "L") && (!foundl)) {
			foundl = true;
			lettercontainer = document.createElement("span");
		} else if (findingle && foundl && (t[i] == "E") && (!founde)) {
			founde = true;
			lettercontainer = document.createElement("span");
		} else if (t[i] == " ") {
			lettercontainer = document.createElement("span");
		} else {
			lettercontainer = document.createElement("letter");
			lettercontainer.classList.add("lordenglish");
		}
		lettercontainer.innerText = t[i];
		container.appendChild(lettercontainer);
	}
	
	return container;
}