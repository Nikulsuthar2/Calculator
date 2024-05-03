const numkeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const opkeys = ["+", "-", "*", "/", "%", ".", "(", ")"];

const display = document.getElementById("display-text");
const historylist = document.getElementById("history-list");
const displayhistory = document.getElementById("display-history");

display.innerHTML = "";
historylist.innerHTML = "";

function allClear() {
    display.innerHTML = "";
    displayhistory.innerHTML = "";
}

function clearVal() {
    let s = display.innerHTML;
    if(s[s.length-1] == "(")
        hasStartBrace = false;
    display.innerHTML = s.substring(0,s.length-1);
}

let dotCount = 0;
let isNum = true;
let hasStartBrace = false;

function appendVal(val) {
    let len = display.innerHTML.length;
    if(len == 0 && val == "-") {
        display.innerHTML += val;
    }
    else if(val == "." && isNum==true && dotCount < 1) {
        display.innerHTML += val;
        dotCount++;
    }
    else if(numkeys.includes(val)) {
        display.innerHTML += val;
        isNum = true;
    }
    else if(opkeys.includes(val) && val != "." && val !="(" && val != ")" && len > 0 ){
        if(!opkeys.includes(display.innerHTML[display.innerHTML.length-1])) {
            display.innerHTML += val;
            isNum = false;
            dotCount = 0;
        }
        else{
            let str = display.innerHTML;
            str = str.substring(0,str.length-1) + val;
            display.innerHTML = str;
        }
    }
    else if(val == "("  && hasStartBrace == false) {
        isNum = false;
        dotCount = 0;
        hasStartBrace = true;
        display.innerHTML += val;
    }
    else if(val == ")" && hasStartBrace == true) {
        isNum = false;
        dotCount = 0;
        hasStartBrace = false;
        display.innerHTML += val;
    }
}

function equalResult() {
    let history = "";
    if(display.innerHTML.trim() != "") {
        history = display.innerHTML.trim() + " = ";
        display.innerHTML = eval(display.innerHTML);
        history += display.innerHTML;
        displayhistory.innerHTML = history.split(" = ")[0];
    }
    if(history != "") {
        if(localStorage.getItem("history-calculator") == null || localStorage.getItem("history-calculator") == "") {
            historylist.innerHTML = "";
        }
        if(localStorage.getItem("history-calculator") == null) {
            localStorage.setItem("history-calculator",history+";")
        }
        else {
            localStorage.setItem("history-calculator",localStorage.getItem("history-calculator")+history+";")
        }
        historylist.innerHTML += "<div class='history-text'><p onclick='setHistoryBack(this)'>"+history+"<p><input class='history-close-btn' type='button' value='⛔' onclick='removeStorage(this.parentNode.parentNode.firstChild.innerHTML);this.parentNode.parentNode.remove();'</div>";
    }
}

function displayNoHistory() {
    historylist.innerHTML = "<div class='history-empty'>No History</div>";
}

function removeStorage(val) {
    if(localStorage.getItem("history-calculator") != null){
        let str = localStorage.getItem("history-calculator");
        str = str.replace(val+";","");
        if(str == "") {
            displayNoHistory()
        }
        localStorage.setItem("history-calculator",str);
    }
}

function setHistoryBack(e){
    let s = e.innerHTML.split(" = ");
    displayhistory.innerHTML = s[0];
    display.innerHTML = s[1];
}

if(localStorage.getItem("history-calculator") != null) {
    let history = localStorage.getItem("history-calculator");
    history = history.split(";")

    for(let i=0; i<history.length-1; i++) {
        historylist.innerHTML += "<div class='history-text'><p  onclick='setHistoryBack(this)'>"+history[i]+"<p><input class='history-close-btn' type='button' value='⛔' onclick='removeStorage(this.parentNode.parentNode.firstChild.innerHTML);this.parentNode.parentNode.remove();'</div>";
    }
}

if(historylist.innerHTML == "") {
    displayNoHistory();
}

document.addEventListener('keydown',(event) => {
    if(numkeys.includes(event.key) || opkeys.includes(event.key)) {
        appendVal(event.key);
    }
    if(event.key == "Enter") {
        equalResult();
        event.preventDefault();
    }
    if(event.key == "Backspace") {
        clearVal();
    }
    if(event.key == "Escape") {
        allClear();
    }
});