var game = null;

function getButtonText() {
    return document.getElementById("start_pause").innerHTML;
}

function setButtonText(t) {
    return document.getElementById("start_pause").innerHTML = t;
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
    var t = new Template();
    var select = document.getElementById("template");
    var i = 0;
    t.getTemplates().forEach(function(n) {
      var option = document.createElement('option');
      option.setAttribute('value', (n.id == undefined) ? i++ : n.id);
      option.innerHTML = n.name;
      select.appendChild(option);
    });

    this.game = new GameOfLife(t);
    if (!this.game.setCanvas("gameCanvas")) {
        return false
    }
    this.game.init();
    this.game.defaultCell(0);

    return true;
}