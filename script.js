//global variables
var major = [0, 2, 4, 5, 7, 9, 11];
var minor = [0, 2, 3, 5, 7, 8, 10];
const beginner = {
    range: [2, 4],
    lives: 3,
    time: [8, 60],
    drone: true,
    freqThreshold: 0.7,
    justThreshold: 0.82,
    advanced: {
        showOptions: true,
        minTime: 0.9,//sets the minimum time for time attack
        timeRate: 0.955,// 0 < timeRate < 1; sets how fast the time requirement will shrink
    }
}
const intermediate = {//
    range: [4, 7],
    lives: 2,
    time: [6, 25],
    drone: true,
    freqThreshold: 0.8,
    justThreshold: 0.87,
    advanced: {
        showOptions: true,
        minTime: 0.9,//sets the minimum time for time attack
        timeRate: 0.955,// 0 < timeRate < 1; sets how fast the time requirement will shrink
    }
}
const advanced = {
    range: [7, 12],
    lives: 1,
    time: [4, 15],
    drone: false,
    freqThreshold: 0.85,
    justThreshold: 0.92,
    advanced: {
        showOptions: false,
        minTime: 0.88,//sets the minimum time for time attack
        timeRate: 0.955,// 0 < timeRate < 1; sets how fast the time requirement will shrink
    }
}

var Settings = {
    advanced: {
        minTime: 0.9,//sets the minimum time for time attack
        timeRate: 0.95,// 0 < timeRate < 1; sets how fast the time requirement will shrink
        showOptions: true,//Decides wheter to show what possible notes will be picked
    },
    key: 60,
    range: [7, 12],
    scale: major,
    lives: 3,
    time: [5, 20],//sets the amount of time given to answer a question. [0] is pitch, [1] is frequency
    drone: true,
    skill: "pitch",
    game: "endurance",
    song:  "resources/HoliznaCC0 - Classic.mp3",
    freqThreshold: 0.8,//What cutoff frequency accuracy the Frequency skill will consider correct
    justThreshold: 0.8,
    chords: [{notes: [0, 4, 7], quality: "major"}],
    inversion: false,
    inversionProbability: 0.6,
    chordOctaveSpread: 1,//how many octaves to spread generated chords out
    tuningError: 0.3,//in just intonation mode, sets how far off the chords can be in semitones
    filter: 8//How many times higher than a note's frequency its filter should be
};

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
var keyOn = [];
var embed = false;

var i11 = true;
var i12;
var i13;
var i21 = true;
var i22;
var i23;
var i31;
var i32 = true;
var i33;
var i41 = true;
var i42;
var i43;
var f41 = true;
var f42;
var f43;

document.addEventListener("click", (event) => {globalInputs(event);});

function globalInputs(event){
    var id = event.srcElement.id;
    if (id == "info"){
        document.getElementById("infoMenu").hidden = false;
    }
    if (id == "infoClose"){
        document.getElementById("infoMenu").hidden = true;
    }
}
   
//global variables

//Initialize all audio
const audioContext = new AudioContext();
const drone = new OscillatorNode(audioContext);
const droneFlt = new BiquadFilterNode(audioContext);
const droneGain = new GainNode(audioContext);
const example = new OscillatorNode(audioContext);
const exampleFlt = new BiquadFilterNode(audioContext);
const exampleGain = new GainNode(audioContext);

for (i = 0; i < 4; i++){
    eval("var chord" + String(i) + " = new OscillatorNode(audioContext); var chord" + String(i) + "Flt = new BiquadFilterNode(audioContext); var chord" + String(i) + "Gain = new GainNode(audioContext);")
    eval("chord" + String(i) + ".type = 'sawtooth';");
    eval("chord" + String(i) + "Gain.gain.value = 0;");
    eval("chord" + String(i) + ".connect(chord" + String(i) + "Flt);");
    eval("chord" + String(i) + "Flt.connect(chord" + String(i) + "Gain);");
    eval("chord" + String(i) + "Gain.connect(audioContext.destination);");
    eval("chord" + String(i) + ".start(audioContext.currentTime);")
}

var htmlSource = document.getElementById("audio");
const source = new MediaElementAudioSourceNode(audioContext, {mediaElement: htmlSource});
const hearAndMatchFlt = new BiquadFilterNode(audioContext);
const hearAndMatchGain = new GainNode(audioContext);

drone.type = "square";
example.type = "sawtooth";
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
source.connect(hearAndMatchGain);
hearAndMatchGain.connect(hearAndMatchFlt);
hearAndMatchFlt.connect(audioContext.destination);
//Initialize all audio

startMenu();
function startMenu(){
    document.getElementById("startMenu").hidden = false;
    document.getElementById("body").className = "bodyOff";
    document.getElementById("cutoff").value = 20000;
    check();
    var abort = new AbortController;
    exampleOff();
    document.addEventListener("click", (event) => {inputs(event);}, {signal: abort.signal});
    function inputs(event){
        var id = event.srcElement.id;
        if (id == "i11"){
            i11 = true; i12 = false; i13 = false; check();
        }
        if (id == "i12"){
            i11 = false; i12 = true; i13 = false; check();
        }
        if (id == "i13"){
            i11 = false; i12 = false; i13 = true; check();
        }
        if (id == "i21"){
            i21 = true; i22 = false; i23 = false; check();
        }
        if (id == "i22"){
            i22 = true; i21 = false; i23 = false; check();
        }
        if (id == "i23"){
            i23 = true; i21 = false; i22 = false; check();
        }
        if (id == "i31"){
            i31 = true; i32 = false; i33 = false; check();
        }
        if (id == "i32"){
            i32 = true; i31 = false; i33 = false; check();
        }
        if (id == "i33"){
            i33 = true; i31 = false; i32 = false; check();
        }
        if (id == "f41"){
            f41 = true; f42 = false; f43 = false; check();
        }
        if (id == "i41"){
            i41 = true; i42 = false; i43 = false; check();
        }
        if (id == "j41"){
            if (document.getElementById(id).className == "modes"){
                document.getElementById(id).className = "modesActive";
                Settings.chords.push({notes: [0, 4, 7], quality: "major"});
            }
            else{
                document.getElementById(id).className = "modes";
                Settings.chords = Settings.chords.filter((item) => JSON.stringify(item) !== JSON.stringify({notes: [0, 4, 7], quality: "major"}));
            }  
        }
        if (id == "j51"){
            if (document.getElementById(id).className == "modes"){
                document.getElementById(id).className = "modesActive";
                Settings.chords.push({notes: [0, 3, 7], quality: "minor"});
            }
            else{
                document.getElementById(id).className = "modes";
                Settings.chords = Settings.chords.filter((item) => JSON.stringify(item) !== JSON.stringify({notes: [0, 3, 7], quality: "minor"}));
            }  
        }
        if (id == "j42"){
            if (document.getElementById(id).className == "modes"){
                document.getElementById(id).className = "modesActive";
                Settings.chords.push({notes: [0, 4, 7, 11], quality: "maj7"});
            }
            else{
                document.getElementById(id).className = "modes";
                Settings.chords = Settings.chords.filter((item) => JSON.stringify(item) !== JSON.stringify({notes: [0, 4, 7, 11], quality: "maj7"}));
            }  
        }
        if (id == "j52"){
            if (document.getElementById(id).className == "modes"){
                document.getElementById(id).className = "modesActive";
                Settings.chords.push({notes: [0, 3, 7, 10], quality: "min7"});
            }
            else{
                document.getElementById(id).className = "modes";
                Settings.chords = Settings.chords.filter((item) => JSON.stringify(item) !== JSON.stringify({notes: [0, 3, 7, 10], quality: "min7"}));
            }  
        }
        if (id == "j43"){
            if (document.getElementById(id).className == "modes"){
                document.getElementById(id).className = "modesActive";
                Settings.chords.push({notes: [0, 4, 7, 10], quality: "dom7"});
            }
            else{
                document.getElementById(id).className = "modes";
                Settings.chords = Settings.chords.filter((item) => JSON.stringify(item) !== JSON.stringify({notes: [0, 4, 7, 10], quality: "dom7"}));
            }  
        }
        if (id == "j53"){
            if (document.getElementById(id).className == "modes"){
                document.getElementById(id).className = "modesActive";
                Settings.inversion = true;
            }
            else{
                document.getElementById(id).className = "modes";
                Settings.inversion = false;
            }  
        }
        if (id == "i42"){
            i42 = true; i41 = false; i43 = false; check();
        }
        if (id == "i43"){
            i43 = true; i41 = false; i42 = false; check();
        }
        if (id == "start"){
            start();
        }
        if (id == "song"){
            check();
        }
    }

    function start(){
        Settings.key = Number(document.getElementById("key").value);
        if (document.getElementById("song").value == "custom"){
            if (document.getElementById("file").value != ""){
                embed = false;
                Settings.song = window.URL.createObjectURL(document.getElementById("file").files[0]);
            }
            /*else if (document.getElementById("url").value != ""){
                embed = true;
                Settings.song = document.getElementById("url").value
            }*/
            else if(Settings.skill == "frequency"){
                alert("No custom file selected!")
                abort.abort();
                startMenu();
                return
            }
        }
        if (Settings.skill == "pitch"){pitch();}
        if (Settings.skill == "frequency"){frequency();}
        if (Settings.skill == "justIntonation"){
            if (Settings.chords.length == 0){
                alert("Must select at least one type of chord!")
                abort.abort();
                startMenu();
                return;
            }
            justIntonation();
        }
        
        document.getElementById("startMenu").hidden = true;
        document.getElementById("body").className = "body";
        abort.abort();
    }
    function check(){
 
        if (i11){//1st column--------------------------------
            document.getElementById("i11").className = "modesActive";
            Settings.skill = "pitch";
            document.getElementsByName("pitch").forEach((element) => {element.hidden = false;});
        }
        else{
            document.getElementById("i11").className = "modes"; 
            document.getElementsByName("pitch").forEach((element) => {element.hidden = true;});
        }
        if (i12){
            document.getElementById("i12").className = "modesActive";
            Settings.skill = "frequency";
            document.getElementsByName("freq").forEach((element) => {element.hidden = false;});
        }
        else{
            document.getElementById("i12").className = "modes"; 
            document.getElementsByName("freq").forEach((element) => {element.hidden = true;});
        }
        if (i13){
            document.getElementById("i13").className = "modesActive";
            Settings.skill = "justIntonation"
            document.getElementsByName("just").forEach((element) => {element.hidden = false;});
        }
        else{
            document.getElementById("i13").className = "modes";
            document.getElementsByName("just").forEach((element) => {element.hidden = true;});
        }//1st column--------------------------------*/
        if (i21){//2nd colum---------------
            document.getElementById("i21").className = "modesActive";
            Settings.game = "endurance";
        }
        else{
            document.getElementById("i21").className = "modes"; 
        }
        if (i22){
            document.getElementById("i22").className = "modesActive";
            Settings.game = "time attack";
        }
        else{
            document.getElementById("i22").className = "modes"; 
        }
        /*if (i23){
            document.getElementById("i23").className = "modesActive";
        }
        else{
            document.getElementById("i23").className = "modes"; 
        }//2nd colum---------------*/
        if (i31){//3rd colum---------------
            document.getElementById("i31").className = "modesActive";
            Settings = Object.assign(Settings, beginner);
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
        if (f41){
            document.getElementById("f41").className = "modesActive";
        }
        else{
            document.getElementById("f41").className = "modes";
        }
        if (document.getElementById("song").value == "rock"){
            Settings.song = "resources/HoliznaCC0 - Classic.mp3"
        }
        else{
            document.getElementById("songSelect").hidden = true;
        }
        if (document.getElementById("song").value == "custom" && i12){
            document.getElementById("songSelect").hidden = false;
        }
        else{
            document.getElementById("songSelect").hidden = true;
        }
    }
}

function randomNote(exception = -1){
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
    if ((note == exception) || (note == undefined)) {
        note = randomNote(exception);
    }
    return note;
    
}

function randomChord(bassNote = ftom(randomFreq(65, 200))){
    var chord = []
    var qualIndex = randomNumber(0, Settings.chords.length - 1)
    Settings.chords[qualIndex].notes.forEach((element) => chord.push(element));
    var bass
    if (Settings.inversion && Math.random() < Settings.inversionProbability){
        bass = randomNumber(0, chord.length - 1);
    }
    else{
        bass = 0
    }
    var offset = bassNote - chord[bass];
    chord.forEach((element) => {
        var index = chord.indexOf(element);
        chord[index] = chord[index] + offset; 
        if (index != bass){
            chord[index] = chord[index] + 12 * randomNumber(0, Settings.chordOctaveSpread);
            if (chord[index] < bassNote){
                chord[index] = chord[index] + 12;
            }
        }
    });
    return {notes: chord, quality: Settings.chords[qualIndex].quality};
}

function randomFreq(min = 40, max = 15000){
    return mtof(((ftom(max) - ftom(min)) * Math.random()) + ftom(min))
}

function randomNumber(min = 0, max = 1){
    return Math.round((max - min) * Math.random() + min)
}

function mtof(x){
    return 440 * 2**((x-69)/12) //convert note to frequency
}
function ftom(x){
    return ((12 * (Math.log(x) - Math.log(440))) / Math.log(2)) + 69;
}


function droneOn(note, time = 0){
    droneGain.gain.setTargetAtTime(0.25, audioContext.currentTime + time, 0.08);
    drone.frequency.setValueAtTime(mtof(note), audioContext.currentTime + time);
    droneFlt.frequency.setValueAtTime(mtof(note) * Settings.filter, audioContext.currentTime + time);
    
}

function exampleOn(note, time = 0){
    exampleGain.gain.setTargetAtTime(0.25, audioContext.currentTime + time, 0.08);
    example.frequency.setValueAtTime(mtof(note), audioContext.currentTime + time);
    exampleFlt.frequency.setValueAtTime(mtof(note) * Settings.filter, audioContext.currentTime + time);
}

function chordOn(chord, time = 0){
    chord.notes.forEach((element, index)=>{
        eval("if (chord" + String(index) + "Gain.gain.value == 0){chord" + String(index) + "Gain.gain.setTargetAtTime(0.25, audioContext.currentTime + time, 0.08);}");
        eval("chord" + String(index) + ".frequency.setValueAtTime(mtof(element), audioContext.currentTime + time);");
        eval("chord" + String(index) + "Flt.frequency.setValueAtTime(mtof(element) * Settings.filter, audioContext.currentTime + time);");
    });
}

function chordOff(){
    for (i = 0; i < 4; i++){
        eval("chord" + String(i) + "Gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);")
    }
}

function droneOff(){
    droneGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
}

function exampleOff(){
    exampleGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.8);
}



function pitch(){
    var inputs = new AbortController;
    //inputs
    document.addEventListener("click", (event) => {inputFunc(event);}, {signal: inputs.signal});
    function inputFunc(event){
        var id = event.srcElement.id;
        if (id == "53"){keyboard = 53; check();}
        if (id == "54"){keyboard = 54; check();}
        if (id == "55"){keyboard = 55; check();}
        if (id == "56"){keyboard = 56; check();}
        if (id == "57"){keyboard = 57; check();}
        if (id == "58"){keyboard = 58; check();}
        if (id == "59"){keyboard = 59; check();}
        if (id == "60"){keyboard = 60; check();}
        if (id == "61"){keyboard = 61; check();}
        if (id == "62"){keyboard = 62; check();}
        if (id == "63"){keyboard = 63; check();}
        if (id == "64"){keyboard = 64; check();}
        if (id == "65"){keyboard = 65; check();}
        if (id == "66"){keyboard = 66; check();}
        if (id == "67"){keyboard = 67; check();}
        if (id == "68"){keyboard = 68; check();}
        if (id == "69"){keyboard = 69; check();}
        if (id == "70"){keyboard = 70; check();}
        if (id == "71"){keyboard = 71; check();}
        if (id == "72"){keyboard = 72; check();}
        if (id == "73"){keyboard = 73; check();}
        if (id == "74"){keyboard = 74; check();}
        if (id == "75"){keyboard = 75; check();}
        if (id == "76"){keyboard = 76; check();}
        if (id == "77"){keyboard = 77; check();}
    }

    document.addEventListener("keydown", keycheck, {signal: inputs.signal});
    function keycheck(key){
        keyboard = qwertyMap.findIndex((element) => (element == key.code));
        if (keyboard != -1){
            var keyString = String(keyboard);
            document.getElementById(keyString).className = "keysActive";
            setTimeout(() => {document.getElementById(keyString).className = "keys";}, 500);
        }
        check();
    }

    //midi
    var midiObject;
    if (navigator.requestMIDIAccess){
        navigator.requestMIDIAccess()
            .then(midiCreate, () => {console.log("Failed to initialize MIDI!")});
    }
    function midiCreate(midi){
        midiObject = midi;
        midiObject.inputs.forEach((entry) => {entry.addEventListener("midimessage", onMIDIMessage, {signal: inputs.signal});});
    }
    function onMIDIMessage(event){
        if (event.data[0] == 144){//if message is a noteonmessage
            keyboard = event.data[1];
            check();
        }
    }
    //midi
    //inputs
    
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }
    var random;
    random = randomNote(Settings.key);
    droneOn(Settings.key);
    document.getElementById(String(Settings.key)).className = "keysDrone";
    if (Settings.advanced.showOptions){
        if (Settings.scale != "chromatic"){
            for (i = 1; i <= Settings.range[0]; i++){//apply styling to the possible key options
                document.getElementById(String(Settings.scale[i - (Settings.scale.length * Math.floor(i/Settings.scale.length))] + (12 * Math.floor(i/Settings.scale.length)) + Settings.key)).className = "keysOptions";
                keyOn[Settings.scale[i - (Settings.scale.length * Math.floor(i/Settings.scale.length))] + (12 * Math.floor(i/Settings.scale.length)) + Settings.key] = true;
            }
        }
        else{
            for (i = 1; i <= Settings.range[1]; i++){//apply styling to the possible key options
                document.getElementById(String(i + Settings.key)).className = "keysOptions";
                keyOn[i + Settings.key] = true;
            }
        }
    }
    

    if (!Settings.drone){
        setTimeout(droneOff, 1000);
    }
    exampleOn(random, 1);
    keyboard = -1;
    
    var lives;
    var time;
    var averageTime;
    var avgAccuracy = 0;
    var score;
    var num;
    var allNum = 0;
    var degradeCount = 0;
    lives = Settings.lives;
    time = audioContext.currentTime + 1;
    averageTime = 0;
    score = 0;
    num = 0;
    var intReturn;

    var x = Settings.time[0];
    if (Settings.game == "time attack") {
        setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1; if (x <= 0) {attackEnd();};}, 100);}, 1000);
    }
    else {
        setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1;}, 100);}, 1000);
    }
    
  
    document.getElementById("score").innerHTML = Math.round(score);

    function check(){
        if (random == keyboard){
            score = score + Math.max(Settings.time[0] - (audioContext.currentTime - time), 0);
            averageTime = ((averageTime * num) + (audioContext.currentTime - time)) / (num + 1);
            avgAccuracy = ((avgAccuracy * allNum) + 1) / (allNum + 1);
            random = randomNote(random);
            keyboard = -1;
            document.getElementById("score").innerHTML = Math.round(score);
            document.getElementById("avgTime").innerHTML = (averageTime.toFixed(2));
            document.getElementById("avgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
            num += 1;
            allNum += 1;
            time = audioContext.currentTime;
            if (Settings.game == "endurance"){
                setTimeout(() => {x = Settings.time[0]}, 100);
            }
            if (Settings.game == "time attack"){
                setTimeout(() => {x = ((Settings.time[0] - Settings.advanced.minTime) * (Settings.advanced.timeRate) ** (degradeCount)) + Settings.advanced.minTime}, 100);
                degradeCount += 1;
            }
            exampleOn(random);
        }
        else{if (keyboard != -1){
            if (keyboard > -1){
                var keystring;
                keystring = String(keyboard);
                document.getElementById(keystring).className = "wrong";
                if (keyOn[keyboard]){
                    setTimeout(() => {document.getElementById(keystring).className = "keysOptions";}, 800);
                }
                else{
                    setTimeout(() => {document.getElementById(keystring).className = "keys";}, 800);
                }
            }
            lives += -1;
            avgAccuracy = ((avgAccuracy * allNum) + 0) / (allNum + 1);
            document.getElementById("avgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
            allNum += 1;
        }
        }
        if (lives == 0){
            inputs.abort();
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
            document.getElementById("menuAvgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
            document.getElementById("endMenu").hidden = false;
            if (Settings.advanced.showOptions){
                setTimeout(() => {
                    if (Settings.scale != "chromatic"){
                        for (i = 1; i <= Settings.range[0]; i++){//apply styling to the possible key options
                            document.getElementById(String(Settings.scale[i - (Settings.scale.length * Math.floor(i/Settings.scale.length))] + (12 * Math.floor(i/Settings.scale.length)) + Settings.key)).className = "keys";
                            keyOn[Settings.scale[i - (Settings.scale.length * Math.floor(i/Settings.scale.length))] + (12 * Math.floor(i/Settings.scale.length)) + Settings.key] = false;
                        }
                    }
                    else{
                        for (i = 1; i <= Settings.range[1]; i++){//apply styling to the possible key options
                            document.getElementById(String(i + Settings.key)).className = "keys";
                            keyOn[i + Settings.key] = false;
                        }
                    } 
                }, 801)
            }
            startMenu();
            keyboard = -1;
            random = -1;
            //reset all previous things
            clearInterval(intReturn);
            exampleOff();
            return;
        }
        
    }
    function attackEnd() { //sets the keyboard to wrong, then immediately checks if wrong to make timing out cost a life
        keyboard = -2;
        check();
        x = Settings.time[0];
        degradeCount = 0;
    }
}

function startAudio(){
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }

    exampleGain.gain.setValueAtTime(0.25, audioContext.currentTime);
    
    example.frequency.setValueAtTime(mtof(note), audioContext.currentTime);
    
    exampleFlt.frequency.setValueAtTime(mtof(note) * Settings.filter, audioContext.currentTime);
    
    example.start(audioContext.currentTime + 1.5);
}

function frequency(){
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }
    if (embed){
        htmlSource = document.getElementById("embed");
    }
    else {
        htmlSource = document.getElementById("audio");
    }
    htmlSource.setAttribute("src", Settings.song)//can choose audio file location
    hearAndMatchGain.gain.setValueAtTime(0.5, audioContext.currentTime);
    htmlSource.loop = true;
    //inputs--------------------------------------------------------
    var inputs = new AbortController;
    var match;
    var matchValue = 20000;
    var hearValue = 20000;
    var avgAccuracy = 0;
    var accuracy;
    var lives;
    var time;
    var averageTime = 0;
    var score = 0;
    degradeCount = 0;
    document.getElementById("cutoff").value = 20000;

    document.addEventListener("click", (event) => {inputFunc(event);}, {signal: inputs.signal});
    function inputFunc(event){
        var id = event.srcElement.id;
        if (id == "hear"){match = false; check();}
        if (id == "match"){match = true; check();}
        if (id == "submit"){submit();}
    }
    document.getElementById("cutoff").addEventListener("input", () => {matchValue = mtof(document.getElementById("cutoff").value); document.getElementById("freqLabel").innerHTML = "Cutoff Frequency: " + String(Math.min(Math.round(matchValue), 20000))  + " Hz"; check();}, {signal: inputs.signal});
    document.getElementById("hear").click();
    function check(){
        if (match){
            document.getElementById("match").className = "modesActive";
            document.getElementById("hear").className = "modes";
            hearAndMatchFlt.frequency.setValueAtTime(matchValue, audioContext.currentTime);
        }
        else{
            document.getElementById("hear").className = "modesActive";
            document.getElementById("match").className = "modes";
            hearAndMatchFlt.frequency.setValueAtTime(hearValue, audioContext.currentTime);
        }   
    }
    //inputs--------------------------------------------------------

    lives = Settings.lives;
    time = audioContext.currentTime;
    averageTime = 0;
    score = 0;
    var num = 0;
    var allNum = 0;
    var intReturn;

    var x = Settings.time[1];
    if (Settings.game == "time attack") {
        setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1; if (x <= 0) {attackEnd();};}, 100);}, 1000);
    }
    else {
        setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1;}, 100);}, 1000);
    }

    htmlSource.play()
    hearValue = randomFreq();
    hearAndMatchFlt.frequency.setValueAtTime(hearValue, audioContext.currentTime);
    function submit(){
        accuracy = (1 - Math.abs((ftom(matchValue) - ftom(hearValue)) / ftom(hearValue)))
        if (accuracy >= Settings.freqThreshold){
            score = score + accuracy * ((Math.max(Settings.time[1] - (audioContext.currentTime - time), 0)) + 10);
            averageTime = ((averageTime * num) + (audioContext.currentTime - time)) / (num + 1);
            avgAccuracy = Math.max(((avgAccuracy * allNum) + accuracy) / (allNum + 1), 0);
            document.getElementById("score").innerHTML = Math.round(score);
            document.getElementById("avgTime").innerHTML = (averageTime.toFixed(2));
            document.getElementById("avgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
            document.getElementById("correct").hidden = false;
            document.getElementById("incorrect").hidden = true;
            document.getElementById("accuracy").innerHTML = String(Math.round(accuracy * 100)) + "%"
            setTimeout(() => {document.getElementById("correct").hidden = true;}, 1000)
            num += 1;
            allNum += 1;
            time = audioContext.currentTime;
            if (Settings.game == "endurance"){
                x = Settings.time[1];
            }
            if (Settings.game == "time attack"){
                x = ((Settings.time[1] - Settings.advanced.minTime) * (Settings.advanced.timeRate) ** (degradeCount)) + Settings.advanced.minTime
                degradeCount += 1;
            }
            hearValue = randomFreq();
            document.getElementById("hear").click();
        }
        else {
            lives += -1;
            avgAccuracy = Math.max(((avgAccuracy * allNum) + accuracy) / (allNum + 1), 0);
            document.getElementById("avgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
            allNum += 1;
            document.getElementById("incorrect").hidden = false;
            document.getElementById("correct").hidden = true;
            document.getElementById("accuracy2").innerHTML = String(Math.round(accuracy * 100)) + "%"
            setTimeout(() => {document.getElementById("incorrect").hidden = true;}, 1000)
        }
        if (lives == 0){
            inputs.abort();
            htmlSource.pause();
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
            document.getElementById("menuAvgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
            document.getElementById("endMenu").hidden = false;
            startMenu();
            //reset all previous things
            clearInterval(intReturn);
            return; 
        }
    }

    function attackEnd(){
        matchValue = 8.176;//either this or set to current value and just force submit
        submit();
        x = Settings.time[1];
        degradeCount = 0;
    }

}

function justIntonation(){
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }

    var inputs = new AbortController;
    var chord = randomChord(48);

    document.getElementById("hearJust").className = "modes";
    document.getElementById("hearError").className = "modesActive";
    document.getElementsByName("justEnd").forEach((element)=> {element.hidden = true;})
    document.getElementById("justSubmit").hidden = false;
    for (j = 0; document.getElementsByClassName("pitchCorrect")[j] != undefined; j++){
        if (j % 2 == 0){
            document.getElementsByClassName("pitchCorrect")[j].value = "0";
        }
        else{
            document.getElementsByClassName("pitchCorrect")[j].value = "0.3";
        }
        document.getElementsByClassName("pitchCorrect")[j].style = "visibility: hidden";
    }

    chord.notes.forEach((element, index) =>{
        chord.notes[index] = chord.notes[index] + Settings.tuningError * 2 * Math.random() - Settings.tuningError / 2;
        document.getElementById("pitch" + String(index)).style = "visibility: visible";
        document.getElementById("gain" + String(index)).style = "visibility: visible";
    })

    var time;
    var averageTime;
    var avgAccuracy = 0;
    var score;
    var num;
    time = audioContext.currentTime + 1;
    averageTime = 0;
    score = 0;
    num = 0;
    var intReturn;

    var x = Settings.time[1];
    if (Settings.game == "time attack") {
        setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1; if (x <= 0) {attackEnd();};}, 100);}, 1000);
    }
    else {
        setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1;}, 100);}, 1000);
    }
    
  
    document.getElementById("score").innerHTML = Math.round(score);

    document.getElementById("qual").innerHTML = "Quality: " + chord.quality;
    chordOn(chord);
    //setTimeout(chordOff, 5000);

    for (i = 0; i < 4; i++){
        document.getElementById("pitch" + String(i)).addEventListener('input', (event) => {
            var index = event.target.id.replaceAll(/\D+/g, "");
            eval("chord" + String(index) + ".frequency.setValueAtTime(mtof(Number(event.target.value) + chord.notes[index]), audioContext.currentTime);")
        }, {signal: inputs.signal});
        document.getElementById("gain" + String(i)).addEventListener('input', (event) => {
            var index = event.target.id.replaceAll(/\D+/g, "");
            eval("chord" + String(index) + "Gain.gain.setValueAtTime((Number(event.target.value)), audioContext.currentTime);")
        }, {signal: inputs.signal});
    }
    var thisError
    document.addEventListener("click", (event)=>{
        var id = event.target.id;
        if (id == "justSubmit"){
            clearInterval(intReturn);
            thisError = check(chord);
            document.getElementsByName("justEnd").forEach((element)=> {element.hidden = false;})
            document.getElementById("justSubmit").hidden = true;
            document.getElementById("3rdError").innerHTML = "3rd: " + String(Math.round(thisError[1] * 10000)/100) + " cents off";
            document.getElementById("5thError").innerHTML = "5th: " + String(Math.round(thisError[2] * 10000)/100) + " cents off";
            if (thisError[3] == undefined){
                document.getElementById("7thError").innerHTML = "         ";
            }
            else {
                document.getElementById("7thError").innerHTML = "7th: " + String(Math.round(thisError[3] * 10000)/100) + " cents off";
            }
            var numErrors = thisError.findLastIndex(()=>true);
            averageTime = (Settings.time[1] - x + averageTime * num) / (num + 1);
            var sumError = 0
            thisError.forEach((element)=> {
                sumError = sumError + Math.abs(element);
            })
            score = (numErrors - sumError) / numErrors * 100 + x;
            avgAccuracy = (avgAccuracy * num + (numErrors - sumError) / numErrors * 100) / (num + 1)
            if (((numErrors - sumError) / numErrors) < Settings.justThreshold){
                attackEnd();
            }
            num = num + 1;
            document.getElementById("score").innerHTML = Math.round(score);
            document.getElementById("avgTime").innerHTML = (averageTime.toFixed(2));
            document.getElementById("avgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
        }
        if (id == "justNext"){
            chordOff();
            document.getElementById("hearJust").className = "modes";
            document.getElementById("hearError").className = "modesActive";
            document.getElementsByName("justEnd").forEach((element)=> {element.hidden = true;})
            document.getElementById("justSubmit").hidden = false;
            for (j = 0; document.getElementsByClassName("pitchCorrect")[j] != undefined; j++){
                if (j % 2 == 0){
                    document.getElementsByClassName("pitchCorrect")[j].value = "0";
                }
                else{
                    document.getElementsByClassName("pitchCorrect")[j].value = "0.3";
                }
                document.getElementsByClassName("pitchCorrect")[j].style = "visibility: hidden";
            }
            chord = randomChord(48);
            chord.notes.forEach((element, index) =>{
                eval("chord" + index + "Gain.gain.setTargetAtTime(0.3, audioContext.currentTime, 0.2);")
                document.getElementById("pitch" + String(index)).style = "visibility: visible";
                document.getElementById("gain" + String(index)).style = "visibility: visible";
                chord.notes[index] = chord.notes[index] + Settings.tuningError * 2 * Math.random() - Settings.tuningError / 2;
            })
            document.getElementById("qual").innerHTML = "Quality: " + chord.quality;
            chordOn(chord);
            x = Settings.time[1];
            if (Settings.game == "time attack") {
                x = (Settings.time[1] - 1.8) * 1.2 ** (-0.6 * num) + 1.8;
                setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1; if (x <= 0) {attackEnd();};}, 100);}, 100);
            }
            else {
                setTimeout(() => {intReturn = setInterval(() => {document.getElementById("time").innerHTML = Math.max(x.toFixed(1), 0); x += -0.1;}, 100);}, 100);
            }
            time = audioContext.currentTime;
        }
        if (id == "hearError"){
            if (event.target.className != "modesActive"){
                chord.notes.forEach((element, index)=>{
                    chord.notes[index] = chord.notes[index] + thisError[index];
                })
                chordOn(chord);
            }
            event.target.className = "modesActive";
            document.getElementById("hearJust").className = "modes"
        }
        if (id == "hearJust"){
            if (event.target.className != "modesActive"){
                chord.notes.forEach((element, index)=>{
                    chord.notes[index] = chord.notes[index] - thisError[index];
                })
                chordOn(chord);
            }
            event.target.className = "modesActive";
            document.getElementById("hearError").className = "modes"
        }
        //show error, and allow user to switch between in-tune and their tuning
    }, {signal: inputs.signal});

    function attackEnd(){
        clearInterval(intReturn);
        chord.notes.forEach((element, index)=>{
            chord.notes[index] = chord.notes[index] - thisError[index];
        })
        chordOn(chord);
        setTimeout(()=>{chordOff();}, 1000);
        document.getElementById("endMenuLabel").innerHTML = "Game Over!"
        document.getElementById("menuScore").innerHTML = Math.round(score);
        document.getElementById("menuAvgTime").innerHTML = (averageTime.toFixed(2));
        document.getElementById("menuHighScore").innerHTML = "N/a";
        document.getElementById("menuAvgAccuracy").innerHTML = (avgAccuracy.toFixed(2));
        document.getElementById("endMenu").hidden = false;
        startMenu();
        return;
    }

    function check(chord){

        chord.notes.forEach((element, index) =>{
            chord.notes[index] = chord.notes[index] + Number(document.getElementById('pitch' + String(index)).value);
        })
        var chordError = [0, 0, 0]
        if (chord.quality == "major" || chord.quality == "maj7" || chord.quality == "dom7"){//check the major third's tuning
            chordError[1] = justIntonationError(chord.notes[0], chord.notes[1], 5);
        }
        if (chord.quality == "minor" || chord.quality == "min7"){//check the minor third's tuning
            chordError[1] = justIntonationError(chord.notes[0], chord.notes[1], 6/5);
        }
        chordError[2] = justIntonationError(chord.notes[0], chord.notes[2], 3) ;
        if (chord.quality == "dom7"){//check domininat 7 chord tuning
            chordError[3] = justIntonationError(chord.notes[0], chord.notes[3], 7);
        }
        if (chord.quality == "maj7" || chord.quality == "min7"){//check maj and minor 7 tuning
            chordError[3] = justIntonationError(chord.notes[1] - chordError[1], chord.notes[3], 3);
        }

        return chordError;
    }
}

function justIntonationError(root=60, interval=63, ratio=6/5){
    var best = 200;//arbitraily large number
    var test;
    for (i = -5; i < 6; i++){
        test = ftom(2 ** i / ratio * mtof(interval)) - root;
        if (Math.abs(test) < Math.abs(best)){
            best = test;
        }
    }
    return best;
};

document.getElementById("i13").click();
document.getElementById("i31").click();