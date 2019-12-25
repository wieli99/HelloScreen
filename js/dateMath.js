// www.wieli.at
// By Florian Wieland
// IF YOU HAVE QUESTIONS: reddit.com/u/wieli99


//CHANGE THIS TO YOUR NAME
const name = "Reddit";









var currentdate = new Date();
hour = currentdate.getHours();
updateDate();

//YOU CAN CHANGE THESE IF YOU WANT TO, IT WON'T BREAK ANYTHING
function cycleMainMessage() {
    if (hour <= 6){
        document.getElementById("greeting").innerHTML = "Hello there, up early?";
    } else if (hour > 6 && hour <= 9){
        document.getElementById("greeting").innerHTML = "Good morning, " + name + " have a great day!";
    } else if (hour > 9 && hour <= 10){
        document.getElementById("greeting").innerHTML = "I hope you are already awake, " + name + "?";
    } else if (hour == 11){
        document.getElementById("greeting").innerHTML = "It's lunch time soon! YAY :)";
    } else if (hour > 11 && hour <= 15){
        document.getElementById("greeting").innerHTML = "Hi " + name + ". Did you have lunch already?";
    } else if (hour > 15 && hour <= 19){
        document.getElementById("greeting").innerHTML = "Have a pleasent afternoon, " + name;
    } else if (hour > 19 && hour <= 22){
        document.getElementById("greeting").innerHTML = "It's time to relax! Good evening...";
    } else {
        document.getElementById("greeting").innerHTML = "It's time to go to bed, " + name + ". Sleep well ^-^";
    }
}

function cycleDate() {
    document.getElementById("dateToday").innerHTML = currentdate.getFullYear() + "-" + (parseInt(currentdate.getMonth())+1).toString() + "-" + currentdate.getDate();

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    document.getElementById("dayName").innerHTML = days[currentdate.getDay()];
}



async function updateDate() {
    for (i=1; i<2;){
        cycleDate();
        cycleMainMessage();
        await sleep(5000);
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML =
        "<span id='hour'>" + h + "</span>" + "<span class='sep'>" + ":" + "</span>" + "<span id='min'>" + m + "</span>";
    var t = setTimeout(startTime, 10000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i;
}