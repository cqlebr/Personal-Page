function setup() {
  createCanvas(800,600);
  background("white");
}

function draw() {
  let colorList = ["red","orange","yellow","green","lightblue","blue","purple","brown","white","black"];

  for(let i = 0; i < 10; i++) {
    fill(colorList[i]);
    rect(3,3 + i * 35, 30, 30);
    noFill();
  }
}

function mousePressed() {
  if (mouseX >= 3 && mouseX <= 33 ) {
    if (mouseY >= 3 && mouseY <= 33) {
      colSelected = color("red");
    } else if (mouseY >= 38 && mouseY <= 68) {
      colSelected = color("orange");
    } else if (mouseY >= 73 && mouseY <= 103) {
      colSelected = color("yellow");
    } else if (mouseY >= 108 && mouseY <= 138) {
      colSelected = color("green");
    } else if (mouseY >= 143 && mouseY <= 173) {
      colSelected = color("lightblue");
    } else if (mouseY >= 178 && mouseY <= 208) {
      colSelected = color("blue");
    } else if (mouseY >= 213 && mouseY <= 243) {
      colSelected = color("purple");
    } else if (mouseY >= 248 && mouseY <= 278) {
      colSelected = color("brown");
    } else if (mouseY >= 283 && mouseY <= 313) {
      colSelected = color("white");
    } else if (mouseY >= 318 && mouseY <= 348) {
      colSelected = color("black");
    }
  }
}

function mouseDragged() {
  strokeWeight(10);
  stroke(colSelected);
  line(pmouseX,pmouseY,mouseX,mouseY);
  stroke("black");
  strokeWeight(1);
}