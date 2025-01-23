function setup() {
  createCanvas(400, 200);
}

function draw() {
  background("black");
  noStroke();
  
  fill('yellow');
  arc(100,100,150,150,PI + PI/4, PI - PI/4);
  fill("red");
  rect(225,100,150,75);
  circle(300,100,150);
  
  fill("white");
  circle(265,100,50);
  circle(335,100,50);
  fill("blue");
  circle(265,100,30);
  circle(335,100,30);
  
}