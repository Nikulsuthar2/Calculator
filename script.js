const numkeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const opkeys = ["+", "-", "*", "/", "%", ".", "(", ")","^"];

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
    if(s.substring(s.length-2,s.length) == "**"){
        display.innerHTML = s.substring(0,s.length-2);
    }else{
        display.innerHTML = s.substring(0,s.length-1);
    }
}

// on previous expression click set expression to display and clear previous history
function getPrevHistoryBack(el){
    let s = el.innerHTML;
    if(s[s.length-1] == "!")
        display.innerHTML = s.substring(0,s.length-1);
    else
        display.innerHTML = s.substring(0,s.length);
    el.innerHTML = "";
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
            if(display.innerHTML[display.innerHTML.length-1] != ")"){
                let str = display.innerHTML;
                str = str.substring(0,str.length-1) + val;
                display.innerHTML = str;
            } else {
                display.innerHTML += val;
                isNum = false;
                dotCount = 0;
            }
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

function findFactorial(){
    let n = parseInt(eval(display.innerHTML));
    if(isNaN(n)) n = 0;
    let f = 1;
    for(let i=1; i<=n; i++){
        f *= i;
    }
    display.innerHTML = f;
    equalResult(true,n);
}

function equalResult(fact=false,n=0) {
    let history = "";

    if(display.innerHTML.trim() != "") {
        history = fact ? n.toString() + "! = " : display.innerHTML.trim() + " = ";
        display.innerHTML = eval(display.innerHTML.replace("^","**"));
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
    if(event.shiftKey && event.key == "^") {
        appendVal("^");
    }
});