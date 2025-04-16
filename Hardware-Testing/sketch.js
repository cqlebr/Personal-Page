// p5.js Sketch

let port;
let connectButton;
let currentMode = "STOP"; // will hold "RAINBOW" or "STOP"

function setup() {
  createCanvas(400, 400);
  connectButton = createButton('Connect Arduino');
  connectButton.mousePressed(connect);
  noStroke();
  port = createSerial();
}

function draw() {
  background(255);
  
  // Read the latest serial data until newline:
  let str = port.readUntil("\n");
  if (str !== "") {
    // Trim whitespace and update current mode.
    let mode = str.trim();
    if (mode === "RAINBOW" || mode === "STOP") {
      currentMode = mode;
    }
  }
  
  if (currentMode === "RAINBOW") {
    // Draw rainbow animated rectangles:
    let r1 = floor(sin(frameCount * 0.1) * 127 + 128);
    let g1 = floor(sin(frameCount * 0.1 + TWO_PI / 3) * 127 + 128);
    let b1 = floor(sin(frameCount * 0.1 + (2 * TWO_PI) / 3) * 127 + 128);
    fill(r1, g1, b1);
    rect(0, 0, width/2, height/2);
    
    let r2 = floor(sin(frameCount * 0.1 + 1) * 127 + 128);
    let g2 = floor(sin(frameCount * 0.1 + 1 + TWO_PI / 3) * 127 + 128);
    let b2 = floor(sin(frameCount * 0.1 + 1 + (2 * TWO_PI) / 3) * 127 + 128);
    fill(r2, g2, b2);
    rect(width/2, 0, width/2, height/2);
    
    let r3 = floor(sin(frameCount * 0.1 + 2) * 127 + 128);
    let g3 = floor(sin(frameCount * 0.1 + 2 + TWO_PI / 3) * 127 + 128);
    let b3 = floor(sin(frameCount * 0.1 + 2 + (2 * TWO_PI) / 3) * 127 + 128);
    fill(r3, g3, b3);
    rect(0, height/2, width/2, height/2);
    
    let r4 = floor(sin(frameCount * 0.1 + 3) * 127 + 128);
    let g4 = floor(sin(frameCount * 0.1 + 3 + TWO_PI / 3) * 127 + 128);
    let b4 = floor(sin(frameCount * 0.1 + 3 + (2 * TWO_PI) / 3) * 127 + 128);
    fill(r4, g4, b4);
    rect(width/2, height/2, width/2, height/2);
  } else {
    // Fixed mode: static colored rectangles.
    fill(255, 0, 0);    // top-left red
    rect(0, 0, width/2, height/2);
    fill(0, 255, 0);    // top-right green
    rect(width/2, 0, width/2, height/2);
    fill(0, 0, 255);    // bottom-left blue
    rect(0, height/2, width/2, height/2);
    fill(255, 255, 0);  // bottom-right yellow
    rect(width/2, height/2, width/2, height/2);
  }
  
  // Send the current mouse pixel color to Arduino.
  let c = get(mouseX, mouseY);
  if (port.opened()) {
    let msg = c[0] + "," + c[1] + "," + c[2] + "\n";
    port.write(msg);
  }
}

function connect() {
  port.open('Arduino', 9600);
}
