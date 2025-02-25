let sounds = {};
let playButtons = [];
let stopButtons = [];
let volumeSliders = [];
let distortion;
let distortionSlider;
let soundNames = ["Birds", "Rain", "Thunder", "Water", "Wind"];
let currentDistortionValue = 0;

function preload() {
    soundNames.forEach(name => {
        sounds[name] = loadSound(`${name}.mp3`);
    });
}

function setup() {
    createCanvas(500, 400);
    background(240);
    textAlign(CENTER, CENTER);
   
    let yOffset = 70;
    soundNames.forEach((name, index) => {
        // Play button
        let playBtn = createButton("Play " + name);
        playBtn.position(50, yOffset + index * 50);
        playBtn.size(100, 30);
        playBtn.style("background-color", "#4CAF50");
        playBtn.style("color", "white");
        playBtn.style("border", "none");
        playBtn.style("border-radius", "5px");
        playBtn.style("cursor", "pointer");
        playBtn.mousePressed(() => playSound(name));
        playButtons.push(playBtn);
        
        // Stop button
        let stopBtn = createButton("Stop " + name);
        stopBtn.position(160, yOffset + index * 50);
        stopBtn.size(100, 30);
        stopBtn.style("background-color", "#f44336");
        stopBtn.style("color", "white");
        stopBtn.style("border", "none");
        stopBtn.style("border-radius", "5px");
        stopBtn.style("cursor", "pointer");
        stopBtn.mousePressed(() => stopSound(name));
        stopButtons.push(stopBtn);
        
        // Volume slider
        let volSlider = createSlider(0, 1, 0.5, 0.01);
        volSlider.position(270, yOffset + index * 50 + 5);
        volSlider.style("width", "120px");
        volSlider.input(() => updateVolume(name, volSlider.value()));
        volumeSliders.push(volSlider);
        
        // Set initial volume
        sounds[name].setVolume(0.5);
        
        // Volume label
        let volLabel = createP("Volume");
        volLabel.position(340, yOffset + index * 50 - 10);
        volLabel.style("font-size", "12px");
        volLabel.style("color", "#333");
        volLabel.style("margin", "0");
    });
   
    // Create distortion effect
    distortion = new p5.Distortion();
    
    // Create distortion slider
    distortionSlider = createSlider(0, 1, 0, 0.01);
    distortionSlider.position(300, height - 80);
    distortionSlider.style("width", "150px");
    distortionSlider.input(updateDistortion);
   
    let label = createP("Distortion");
    label.position(340, height - 110);
    label.style("font-size", "16px");
    label.style("color", "#333");
   
    let title = createP("Sound Sampler of Nature");
    title.position(width/2 - 160, 1);
    title.style("font-size", "24px");
    title.style("font-weight", "bold");
   
    // Initialize distortion
    updateDistortion();
}

function updateDistortion() {
    currentDistortionValue = distortionSlider.value();
    distortion.set(currentDistortionValue); // Set distortion amount
}

function updateVolume(name, value) {
    sounds[name].setVolume(value);
}

function playSound(name) {
    if (sounds[name].isPlaying()) {
        sounds[name].stop();
    }
   
    // Connect to distortion if needed
    if (currentDistortionValue > 0) {
        sounds[name].disconnect();
        sounds[name].connect(distortion);
    } else {
        sounds[name].disconnect();
        sounds[name].connect();
    }
   
    sounds[name].play();
}

function stopSound(name) {
    if (sounds[name].isPlaying()) {
        sounds[name].stop();
    }
}

function draw() {
    background(220);
    fill(50);
    textSize(14);
    text("Make your own nature experience by turning on and off different sounds.", width / 2, height - 20);
}