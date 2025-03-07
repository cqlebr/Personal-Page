// Synth setup
let basicSynth, metalSynth, fmSynth, noiseSynth, pluckSynth, membraneSynth, amSynth, polySynth;
// Object to track key states (pressed or not)
let keyStates = {
  'a': false,
  's': false,
  'd': false,
  'f': false,
  'g': false,
  'h': false,
  'j': false,
  'k': false
};

// Slider objects
let reverb;
let reverbSlider;
let filterSlider;
let vibratoSlider;
let filter;
let vibrato;
let distortionSlider;
let distortion;

function setup() {
  createCanvas(800, 400); // Increased canvas height for sliders
  textSize(16);
  
  // Initialize Tone.js
  Tone.start();
  
  // Set up effects
  reverb = new Tone.Reverb(3).toDestination();
  filter = new Tone.Filter(1000, "lowpass").connect(reverb);
  vibrato = new Tone.Vibrato(5, 0.1).connect(filter);
  distortion = new Tone.Distortion(0).connect(vibrato);
  
  // Initialize synths (connected to effects chain)
  basicSynth = new Tone.Synth().connect(distortion);
  metalSynth = new Tone.MetalSynth().connect(distortion);
  fmSynth = new Tone.FMSynth().connect(distortion);
  noiseSynth = new Tone.Synth().connect(distortion);
  pluckSynth = new Tone.PluckSynth().connect(distortion);
  membraneSynth = new Tone.MembraneSynth().connect(distortion);
  amSynth = new Tone.AMSynth().connect(distortion);
  polySynth = new Tone.PolySynth().connect(distortion);
  
  // Create sliders
  reverbSlider = createSlider(0, 1, 0.3, 0.01);
  reverbSlider.position(30, 310);
  reverbSlider.style('width', '150px');
  
  filterSlider = createSlider(100, 10000, 1000, 1);
  filterSlider.position(230, 310);
  filterSlider.style('width', '150px');
  
  vibratoSlider = createSlider(0, 10, 0, 0.1);
  vibratoSlider.position(410, 310);
  vibratoSlider.style('width', '150px');
  
  distortionSlider = createSlider(0, 1, 0, 0.01);
  distortionSlider.position(600, 310);
  distortionSlider.style('width', '150px');
}

function draw() {
  background(50);
  drawKeyboard();
  drawSliders();
  
  // Update effect parameters based on slider values
  reverb.wet.value = reverbSlider.value();
  filter.frequency.value = filterSlider.value();
  vibrato.depth.value = vibratoSlider.value() / 10;
  distortion.distortion = distortionSlider.value();
}

function drawKeyboard() {
  const keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
  const notes = ['E5', 'C5', 'A4', 'G4', 'B4', 'D5', 'F#4', 'A5'];
  const keyWidth = 80;
  const keyHeight = 180; // Reduced height to fit sliders
  const startX = (width - (keys.length * keyWidth)) / 2;
  
  // Draw each key
  for (let i = 0; i < keys.length; i++) {
    const x = startX + (i * keyWidth);
    const isPressed = keyStates[keys[i]];
    
    // Key background
    fill(isPressed ? color(100, 200, 255) : 255);
    stroke(0);
    rect(x, 50, keyWidth - 5, keyHeight);
    
    // Key letter
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(keys[i].toUpperCase(), x + keyWidth/2, 160);
    
    // Note name
    textSize(16);
    text(notes[i], x + keyWidth/2, 190);
  }
  
  // Display instructions
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("Press keys A through K to play sounds", width/2, 30);
}

function drawSliders() {
  fill(255);
  textAlign(LEFT);
  textSize(14);
  
  text("Reverb", 40, 300);
  text(round(reverbSlider.value() * 100) + "%", 100, 340);
  
  text("Filter", 240, 300);
  text(round(filterSlider.value()) + " Hz", 280, 340);
  
  text("Vibrato", 420, 300);
  text(round(vibratoSlider.value() * 10) / 10, 480, 340);
  
  text("Distortion", 610, 300);
  text(round(distortionSlider.value() * 100) + "%", 670, 340);
  
  // Additional instructions
  fill(200);
  textAlign(CENTER);
  textSize(14);
  text("Adjust sliders to change the sound characteristics", width/2, 380);
}

function keyPressed() {
  // Get the pressed key as lowercase
  let pressedKey = key.toLowerCase();
  
  if (pressedKey in keyStates) {
    // Only trigger if the key wasn't already pressed
    if (!keyStates[pressedKey]) {
      keyStates[pressedKey] = true;
      
      if (pressedKey === "a") {
        basicSynth.triggerAttack("E5");
      } else if (pressedKey === "s") {
        metalSynth.triggerAttackRelease("C5", 4);
      } else if (pressedKey === "d") {
        fmSynth.triggerAttack("A4");
      } else if (pressedKey === "f") {
        noiseSynth.triggerAttack("G4");
      } else if (pressedKey === "g") {
        pluckSynth.triggerAttack("B4");
      } else if (pressedKey === "h") {
        membraneSynth.triggerAttack("D5");
      } else if (pressedKey === "j") {
        amSynth.triggerAttack("F#4");
      } else if (pressedKey === "k") {
        polySynth.triggerAttackRelease("A5", 0.5);
      }
    }
  }
  
  // Prevent default browser behavior
  return false;
}

function keyReleased() {
  // Get the released key as lowercase
  let releasedKey = key.toLowerCase();
  
  if (releasedKey in keyStates) {
    keyStates[releasedKey] = false;
    
    if (releasedKey === "a") {
      basicSynth.triggerRelease();
    } else if (releasedKey === "d") {
      fmSynth.triggerRelease();
    } else if (releasedKey === "f") {
      noiseSynth.triggerRelease();
    } else if (releasedKey === "g") {
      pluckSynth.triggerRelease();
    } else if (releasedKey === "h") {
      membraneSynth.triggerRelease();
    } else if (releasedKey === "j") {
      amSynth.triggerRelease();
    }
    // Key "k" uses triggerAttackRelease so we don't need to release it
  }
  
  // Prevent default browser behavior
  return false;
}