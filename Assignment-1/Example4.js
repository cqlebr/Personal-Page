function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background("navy");
    stroke("white");
    strokeWeight(5);
    
    fill("green");
    circle(200,200,200);
    
    fill("red");
    beginShape()
    vertex(100,180);
    vertex(175,180);
    vertex(200,100);
    vertex(225,180);
    vertex(297,180);
    vertex(240,220);
    vertex(260,285);
    vertex(200,245);
    vertex(140,285);
    vertex(160,220);
    vertex(100,180);
    vertex(175,180);
    
    endShape();
  }