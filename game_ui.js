var game = null;

function getButtonText() {
    return document.getElementById("start_pause").innerHTML;
}

function setButtonText(t) {
    return document.getElementById("start_pause").innerHTML = t;
}

function getSize() {
    var t = document.getElementById("worldSize");
    return t.options[t.selectedIndex].value;
}

function getTemplateNo() {
    var t = document.getElementById("template");
    return t.options[t.selectedIndex].value;
}

function startPause() {
    if(getButtonText() == "PAUSE") {
        this.game.pause();
        setButtonText("START");
    } else {
        this.game.start();
        setButtonText("PAUSE");
    }
}

function step() {
    this.game.step();
}

function changeSize() {
    if (this.game != null) reset();
    this.game = new GameOfLife(new Template(), getSize());
    if (!this.game.setCanvas("gameCanvas")) {
        return false
    }
    this.game.init();
    this.game.defaultCell(getTemplateNo());
    return true;
}

function changeTemplate() {
    this.game.pause();
    setButtonText("START");
    this.game.init();
    this.game.defaultCell(getTemplateNo());
}

function reset() {
    this.game.reset();
    setButtonText("START");
}

function setup() {
    var lang = window.navigator.userLanguage
                   || window.navigator.language
                   || window.navigator.browserLanguage;
    lang = (lang.length >= 2) ? lang.substring(0, 2) : lang;
    var select = document.getElementById("template");
    var t = new Template();
    var i = 0;
    t.getTemplates().forEach(function(n) {
      var option = document.createElement('option');
      option.setAttribute('value', (n.id == undefined) ? i++ : n.id);
      option.innerHTML = (eval("n.name_" + lang) == undefined) ? n.name : eval("n.name_" + lang);
      select.appendChild(option);
    });

    select = document.getElementById("worldSize");
    for (var i = 8; i > 1; i--) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        if (i == 6) option.setAttribute('selected', "");
        var s = 1 << i;
        option.innerHTML = s + "x" + s;
        select.appendChild(option);
    }

    return changeSize();
}