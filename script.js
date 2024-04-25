//global variables
var major = [0, 2, 4, 5, 7, 9, 11];
var minor = [0, 2, 3, 5, 7, 8, 10];
const beginner = {
    range: [2, 4],
    lives: 3,
    time: 8,
    drone: true
}
const intermediate = {
    range: [4, 7],
    lives: 2,
    time: 6,
    drone: true
}
const advanced = {
    range: [7, 12],
    lives: 1,
    time: 4,
    drone: false
}
var qwertyMap = [];
qwertyMap[53] = "KeyZ";
qwertyMap[54] = "KeyS";
qwertyMap[55] = "KeyX";
qwertyMap[56] = "KeyD";
qwertyMap[57] = "KeyC";
qwertyMap[58] = "KeyF";
qwertyMap[59] = "KeyV";
qwertyMap[60] = "KeyB";
qwertyMap[61] = "KeyH";
qwertyMap[62] = "KeyN";
qwertyMap[63] = "KeyJ";
qwertyMap[64] = "KeyM";
qwertyMap[65] = "KeyQ";
qwertyMap[66] = "Digit2";
qwertyMap[67] = "KeyW";
qwertyMap[68] = "Digit3";
qwertyMap[69] = "KeyE";
qwertyMap[70] = "Digit4";
qwertyMap[71] = "KeyR";
qwertyMap[72] = "KeyT";
qwertyMap[73] = "Digit6";
qwertyMap[74] = "KeyY";
qwertyMap[75] = "Digit7";
qwertyMap[76] = "KeyU";
qwertyMap[77] = "KeyI";

var keyboard = -1;
var highScore = 0;
var again = false;


var Settings = {
    key: 60,
    range: [7, 12],
    scale: major,
    lives: 3,
    time: 5,
    drone: true
};
//global variables

//Initialize all audio
const audioContext = new AudioContext();
const drone = new OscillatorNode(audioContext);
const droneFlt = new BiquadFilterNode(audioContext);
const droneGain = new GainNode(audioContext);
const example = new OscillatorNode(audioContext);
const exampleFlt = new BiquadFilterNode(audioContext);
const exampleGain = new GainNode(audioContext);

drone.type = "square";
example.type = "sawtooth";
const filter = 1;
droneGain.gain.value = 0;
exampleGain.gain.value = 0;

drone.connect(droneFlt);
droneFlt.connect(droneGain);
droneGain.connect(audioContext.destination);
example.connect(exampleFlt);
exampleFlt.connect(exampleGain);
exampleGain.connect(audioContext.destination);
drone.start(audioContext.currentTime);
example.start(audioContext.currentTime);
//Initialize all audio

startMenu();
function startMenu(){

    var abort = new AbortController;
    var i11 = false;
    var i12 = false;
    var i13 = false;
    var i21 = false;
    var i22 = false;
    var i23 = false;
    var i31 = false;
    var i32 = false;
    var i33 = false;
    var i41 = false;
    var i42 = false;
    var i43 = false;

    document.getElementById("i11").addEventListener("click", () => {i11 = true; i12 = false; i13 = false; check();}, {signal: abort.signal});
    document.getElementById("i12").addEventListener("click", () => {i11 = false; i12 = true; i13 = false; check();}, {signal: abort.signal});
    document.getElementById("i21").addEventListener("click", () => {i21 = true; i22 = false; i23 = false; check();}, {signal: abort.signal});
    document.getElementById("i22").addEventListener("click", () => {i21 = false; i22 = true; i23 = false; check();}, {signal: abort.signal});
    document.getElementById("i23").addEventListener("click", () => {i21 = false; i22 = false; i23 = true; check();}, {signal: abort.signal});
    document.getElementById("i31").addEventListener("click", () => {i31 = true; i32 = false; i33 = false; check();}, {signal: abort.signal});
    document.getElementById("i32").addEventListener("click", () => {i31 = false; i32 = true; i33 = false; check();}, {signal: abort.signal});
    document.getElementById("i33").addEventListener("click", () => {i31 = false; i32 = false; i33 = true; check();}, {signal: abort.signal});
    document.getElementById("i41").addEventListener("click", () => {i41 = true; i42 = false; i43 = false; check();}, {signal: abort.signal});
    document.getElementById("i42").addEventListener("click", () => {i41 = false; i42 = true; i43 = false; check();}, {signal: abort.signal});
    document.getElementById("i43").addEventListener("click", () => {i41 = false; i42 = false; i43 = true; check();}, {signal: abort.signal});
    document.getElementById("start").addEventListener("click", start, {signal: abort.signal});
    function start(){
        Settings.key = Number(document.getElementById("key").value);
        noteRecognition();
        document.getElementById("startMenu").hidden = true;
        abort.abort();
    }
    function check(){
 
        if (i11){//1st column--------------------------------
            document.getElementById("i11").className = "modesActive";
        }
        else{
            document.getElementById("i11").className = "modes"; 
        }
        /*if (i12){
            document.getElementById("i12").className = "modesActive";
        }
        else{
            document.getElementById("i12").className = "modes"; 
        }*/
        /*if (i13){
            document.getElementById("i13").className = "modesActive";
        }
        else{
            document.getElementById("i13").className = "modes"; 
        }//1st column--------------------------------*/
        if (i21){//2nd colum---------------
            document.getElementById("i21").className = "modesActive";
        }
        else{
            document.getElementById("i21").className = "modes"; 
        }
        /*if (i22){
            document.getElementById("i22").className = "modesActive";
        }
        else{
            document.getElementById("i22").className = "modes"; 
        }
        if (i23){
            document.getElementById("i23").className = "modesActive";
        }
        else{
            document.getElementById("i23").className = "modes"; 
        }//2nd colum---------------*/
        if (i31){//3rd colum---------------
            document.getElementById("i31").className = "modesActive";
            Settings = Object.assign(Settings, beginner)
        }
        else{
            document.getElementById("i31").className = "modes"; 
        }
        if (i32){
            document.getElementById("i32").className = "modesActive";
            Settings = Object.assign(Settings, intermediate);
        }
        else{
            document.getElementById("i32").className = "modes"; 
        }
        if (i33){
            document.getElementById("i33").className = "modesActive";
            Settings = Object.assign(Settings, advanced);
        }
        else{
            document.getElementById("i33").className = "modes"; 
        }//3rd column
        if (i41){//4th colum---------------
            document.getElementById("i41").className = "modesActive";
            Settings.scale = major;
        }
        else{
            document.getElementById("i41").className = "modes"; 
        }
        if (i42){
            document.getElementById("i42").className = "modesActive";
            Settings.scale = minor;
        }
        else{
            document.getElementById("i42").className = "modes"; 
        }
        if (i43){
            document.getElementById("i43").className = "modesActive";
            Settings.scale = "chromatic";
        }
        else{
            document.getElementById("i43").className = "modes"; 
        }
    }
}

function randomNote(){
    var position
    
    var note;
    if (Settings.scale != "chromatic"){
        position = Math.round(Settings.range[0] * Math.random());
        note = Settings.scale[position - (Settings.scale.length * Math.floor(position/Settings.scale.length))] + (12 * Math.floor(position/Settings.scale.length)) + Settings.key;
    }
    else {
        position = Math.round(Settings.range[1] * Math.random());
        note = position + Settings.key;
    }
    return note;
}

function mtof(x){
    return 440 * 2**((x-69)/12) //convert note to frequency
}



function droneOn(note, time = 0){
    droneGain.gain.setTargetAtTime(0.25, audioContext.currentTime + time, 0.08);
    drone.frequency.setValueAtTime(mtof(note), audioContext.currentTime + time);
    droneFlt.frequency.setValueAtTime(mtof(note) * filter, audioContext.currentTime + time);
    
}

function exampleOn(note, time = 0){
    exampleGain.gain.setTargetAtTime(0.25, audioContext.currentTime + time, 0.08);
    example.frequency.setValueAtTime(mtof(note), audioContext.currentTime + time);
    exampleFlt.frequency.setValueAtTime(mtof(note) * filter, audioContext.currentTime + time);
}

function droneOff(){
    droneGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
}

function exampleOff(){
    exampleGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.8);
}



function noteRecognition(){
    var inputs = new AbortController;
    //inputs
    document.getElementById("53").addEventListener("click", () => {keyboard = 53; check();}, {signal: inputs.signal});
    document.getElementById("54").addEventListener("click", () => {keyboard = 54; check();}, {signal: inputs.signal});
    document.getElementById("55").addEventListener("click", () => {keyboard = 55; check();}, {signal: inputs.signal});
    document.getElementById("56").addEventListener("click", () => {keyboard = 56; check();}, {signal: inputs.signal});
    document.getElementById("57").addEventListener("click", () => {keyboard = 57; check();}, {signal: inputs.signal});
    document.getElementById("58").addEventListener("click", () => {keyboard = 58; check();}, {signal: inputs.signal});
    document.getElementById("59").addEventListener("click", () => {keyboard = 59; check();}, {signal: inputs.signal});
    document.getElementById("60").addEventListener("click", () => {keyboard = 60; check();}, {signal: inputs.signal});
    document.getElementById("61").addEventListener("click", () => {keyboard = 61; check();}, {signal: inputs.signal});
    document.getElementById("62").addEventListener("click", () => {keyboard = 62; check();}, {signal: inputs.signal});
    document.getElementById("63").addEventListener("click", () => {keyboard = 63; check();}, {signal: inputs.signal});
    document.getElementById("64").addEventListener("click", () => {keyboard = 64; check();}, {signal: inputs.signal});
    document.getElementById("65").addEventListener("click", () => {keyboard = 65; check();}, {signal: inputs.signal});
    document.getElementById("66").addEventListener("click", () => {keyboard = 66; check();}, {signal: inputs.signal});
    document.getElementById("67").addEventListener("click", () => {keyboard = 67; check();}, {signal: inputs.signal});
    document.getElementById("68").addEventListener("click", () => {keyboard = 68; check();}, {signal: inputs.signal});
    document.getElementById("69").addEventListener("click", () => {keyboard = 69; check();}, {signal: inputs.signal});
    document.getElementById("70").addEventListener("click", () => {keyboard = 70; check();}, {signal: inputs.signal});
    document.getElementById("71").addEventListener("click", () => {keyboard = 71; check();}, {signal: inputs.signal});
    document.getElementById("72").addEventListener("click", () => {keyboard = 72; check();}, {signal: inputs.signal});
    document.getElementById("73").addEventListener("click", () => {keyboard = 73; check();}, {signal: inputs.signal});
    document.getElementById("74").addEventListener("click", () => {keyboard = 74; check();}, {signal: inputs.signal});
    document.getElementById("75").addEventListener("click", () => {keyboard = 75; check();}, {signal: inputs.signal});
    document.getElementById("76").addEventListener("click", () => {keyboard = 76; check();}, {signal: inputs.signal});
    document.getElementById("77").addEventListener("click", () => {keyboard = 77; check();}, {signal: inputs.signal});

    document.addEventListener("keydown", keycheck, {signal: inputs.signal});//#
    function keycheck(key){
        keyboard = qwertyMap.findIndex((element) => (element == key.code));
        var keyString = String(keyboard);
        document.getElementById(keyString).className = "keysActive";
        setTimeout(() => {document.getElementById(keyString).className = "keys";}, 500);
        check();
    }
    //inputs

    function reset() {
        document.getElementById("endMenu").hidden = true;
        noteRecognition();
        document.getElementById("retry").removeEventListener("click", reset);
    }
    document.getElementById("body").className = "body";
    
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }
    var random;
    random = randomNote();
    droneOn(Settings.key);
    document.getElementById(String(Settings.key)).className = "keysDrone";
    if (!Settings.drone){
        setTimeout(droneOff, 1000);
    }
    exampleOn(random, 1);
    keyboard = -1;
    
    var lives;
    var time;
    var averageTime;
    var score;
    var num;
    lives = Settings.lives;
    time = audioContext.currentTime + 1;
    averageTime = 0;
    score = 0;
    num = 0;
    var intReturn;

    var x = Settings.time;
    setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1}, 100);}, 1000);
  
    document.getElementById("score").innerHTML = Math.round(score);

    function check(){
        if (random == keyboard){
            score = score + Math.max(Settings.time - (audioContext.currentTime - time), 0);
            averageTime = ((averageTime * num) + (audioContext.currentTime - time)) / (num + 1);
            random = randomNote();
            keyboard = -1;
            document.getElementById("score").innerHTML = Math.round(score);
            document.getElementById("avgTime").innerHTML = (averageTime.toFixed(2));
            num += 1;
            time = audioContext.currentTime + .01;
            setTimeout(() => {x = Settings.time}, 100);
            exampleOn(random, 0.1);
        }
        else{if (keyboard != -1){
            var keystring;
            keystring = String(keyboard);
            lives += -1;
            document.getElementById(keystring).className = "wrong";
            setTimeout(() => {document.getElementById(keystring).className = "keys";}, 800);
        }
        }
        if (lives == 0){
            droneOff();
            document.getElementById(String(Settings.key)).className = "keys";
            exampleOff();
            if (highScore < score) {
                document.getElementById("endMenuLabel").innerHTML = "New High Score!"
                highScore = score;
            }
            else {
                document.getElementById("endMenuLabel").innerHTML = "Game Over!"
            }
            document.getElementById("menuScore").innerHTML = Math.round(score);
            document.getElementById("menuAvgTime").innerHTML = (averageTime.toFixed(2));
            document.getElementById("menuHighScore").innerHTML = Math.round(highScore);
            document.getElementById("endMenu").hidden = false;
            document.getElementById("body").className = "bodyOff";
            keyboard = -1;
            random = -1;
            //reset all previous things
            inputs.abort();
            document.getElementById("retry").addEventListener("click", reset);
            again = true;
            clearInterval(intReturn);
            return;
        }
        
    }
}

function startAudio(){
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }
    var note = randomNote();
    
    exampleGain.gain.setValueAtTime(0.25, audioContext.currentTime);
    
    example.frequency.setValueAtTime(mtof(note), audioContext.currentTime);
    
    exampleFlt.frequency.setValueAtTime(mtof(note) * filter, audioContext.currentTime);
    
    example.start(audioContext.currentTime + 1.5);
}

/* to do: descriptions of difficulty levels, list difficulty in endmenu,
have endmenu be able to go back to main menu. Custom difficulty settings




*/