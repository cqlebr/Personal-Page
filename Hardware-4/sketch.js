let port;
let connectButton;
let colorOffset = 0;

function setup() {
  createCanvas(400, 400);
  connectButton = createButton('Connect Arduino');
  connectButton.mousePressed(connect);
  noStroke();
  port = createSerial();
}

function draw() {
  background(255);

  // Size of the central white square
  let centerSize = 200;
  let borderThickness = 40;

  let r = (sin(frameCount * 0.05 + colorOffset) * 127 + 128);
  let g = (sin(frameCount * 0.05 + colorOffset + TWO_PI / 3) * 127 + 128);
  let b = (sin(frameCount * 0.05 + colorOffset + (2 * TWO_PI) / 3) * 127 + 128);
  let borderColor = color(r, g, b);

  fill(borderColor);

  // Top border
  rect(0, 0, width, borderThickness);
  // Bottom border
  rect(0, height - borderThickness, width, borderThickness);
  // Left border
  rect(0, borderThickness, borderThickness, height - 2 * borderThickness);
  // Right border
  rect(width - borderThickness, borderThickness, borderThickness, height - 2 * borderThickness);

  // White center square
  fill(255);
  rect((width - centerSize) / 2, (height - centerSize) / 2, centerSize, centerSize);
  fill("black");
  circle(width/2,height/2,125);


  // Send color at mouse position if within canvas
  if (port.opened() && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    let c = get(mouseX, mouseY);
    let msg = c[0] + "," + c[1] + "," + c[2] + "\n";
    port.write(msg);
  }
}

function connect() {
  port.open('Arduino', 9600);
}
