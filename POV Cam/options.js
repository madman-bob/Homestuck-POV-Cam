function getRadioOptions(optionname) {
    var values = {};
    values[optionname] = "no";
    chrome.storage.sync.get(values, function (items) {
        document.querySelector("input[name='" + optionname + "'][value='" + items[optionname] + "']").checked = true;
    });
}

function saveOptions(e) {
    var values = {};
    values[e.target.name] = e.target.value;
    chrome.storage.sync.set(values, function () {});
}

var timelineOptions = {};

function getTimelineOptions() {
    var values = {timelinesenabled: timelineOptions};
    chrome.storage.sync.get(values, function (items) {
        timelineOptions = items.timelinesenabled;
        for (var i in groups) {
            group = groups[i];
            document.getElementById(group).checked = (items.timelinesenabled[group] != false);
        }
    });
}

function saveTimelineOptions(e) {
    timelineOptions[e.target.id] = e.target.checked;
    var values = {timelinesenabled: timelineOptions};
    chrome.storage.sync.set(values, function () {});
}

window.onload = function () {
    var radios = document.querySelectorAll("input[type='radio']");
    var previousRadioName = "";
    for (var i = 0; i < radios.length; i++) {
        radios[i].onchange = saveOptions;
        if (previousRadioName != radios[i].name) {
            previousRadioName = radios[i].name;
            getRadioOptions(radios[i].name);
        }
    }

    var t = document.getElementById("timelinespanel");
    for (var i in groups) {
        group = groups[i];
        var container = document.createElement("div");
        var tCheckbox = document.createElement("input");
        tCheckbox.type = "checkbox";
        tCheckbox.id = group;
        tCheckbox.onchange = saveTimelineOptions;
        container.appendChild(tCheckbox);

        var tLabel = document.createElement("label");
        tLabel.innerText = group;
        tLabel.htmlFor = group;
        container.appendChild(tLabel);

        t.appendChild(container);
    }
    getTimelineOptions();

    timelinesenableall.onclick = function () {
        var checkboxes = t.querySelectorAll("[type='checkbox']");
        for (var i in checkboxes) {
            checkboxes[i].checked = false;
            checkboxes[i].click();
        }
    };

    timelinesdisableall.onclick = function () {
        var checkboxes = t.querySelectorAll("[type='checkbox']");
        for (var i in checkboxes) {
            checkboxes[i].checked = true;
            checkboxes[i].click();
        }
    };

    timelinesflipall.onclick = function () {
        var checkboxes = t.querySelectorAll("[type='checkbox']");
        for (var i in checkboxes) {
            checkboxes[i].click();
        }
    };
};
