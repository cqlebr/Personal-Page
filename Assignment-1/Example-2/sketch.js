function setup() {
  createCanvas(400, 400);
}

function draw() {
  background("white");
  noStroke();
  
  fill(255,0,0,75);
  circle(200,125,200);
  fill(0,0,255,75);
  circle(125,250,200);
  fill(0,255,0,75);
  circle(275,250,200);
}