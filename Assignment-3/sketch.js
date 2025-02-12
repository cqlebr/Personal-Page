let ninja;
let goldenmonk;
let purple;
let character1;
let character2;
let character3;

function preload() {
  ninja = loadImage("ninjasprite.png");
  goldenmonk = loadImage("goldenmonk.png");
  purple = loadImage("purple.png");
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  
  character1 = new Character(random(80, width - 80), random(80, height - 80));
  character1.addAnimation("down", new spriteAnimation(ninja, 6, 5, 6));
  character1.addAnimation("up", new spriteAnimation(ninja, 0, 5, 6));
  character1.addAnimation("right", new spriteAnimation(ninja, 0, 0, 9));
  character1.addAnimation("left", new spriteAnimation(ninja, 0, 0, 9));
  character1.addAnimation("stand", new spriteAnimation(ninja, 0, 0, 1));
  character1.currentAnimation = "stand";
  
  character2 = new Character(random(80, width - 80), random(80, height - 80));
  character2.addAnimation("down", new spriteAnimation(goldenmonk, 6, 5, 6));
  character2.addAnimation("up", new spriteAnimation(goldenmonk, 0, 5, 6));
  character2.addAnimation("right", new spriteAnimation(goldenmonk, 0, 0, 9));
  character2.addAnimation("left", new spriteAnimation(goldenmonk, 0, 0, 9));
  character2.addAnimation("stand", new spriteAnimation(goldenmonk, 0, 0, 1));
  character2.currentAnimation = "stand";

  character3 = new Character(random(80, width - 80), random(80, height - 80));
  character3.addAnimation("down", new spriteAnimation(purple, 6, 5, 6));
  character3.addAnimation("up", new spriteAnimation(purple, 0, 5, 6));
  character3.addAnimation("right", new spriteAnimation(purple, 0, 0, 9));
  character3.addAnimation("left", new spriteAnimation(purple, 0, 0, 9));
  character3.addAnimation("stand", new spriteAnimation(purple, 0, 0, 1));
  character3.currentAnimation = "stand";
}

function draw() {
  background(220);
  character1.draw();
  character2.draw();
  character3.draw();
}

function keyPressed() {
  character1.keyPressed(keyCode);
  character2.keyPressed(keyCode);
  character3.keyPressed(keyCode);
}

function keyReleased() {
  character1.keyReleased();
  character2.keyReleased();
  character3.keyReleased();
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch(this.currentAnimation) {
        case "up":
          this.y -= 2;
          break;
        case "down":
          this.y += 2;
          break;
        case "right":
          this.x += 2;
          break;
        case "left":
          this.x -= 2;
          break;
      }
      
      push();
      translate(this.x, this.y);
      if (this.currentAnimation == "left") {
        scale(-1, 1);
      }
      animation.draw();
      pop();
    }
  }

  keyPressed(key) {
    if (key === UP_ARROW) {
      this.currentAnimation = "up";
    } else if (key === DOWN_ARROW) {
      this.currentAnimation = "down";
    } else if (key === RIGHT_ARROW) {
      this.currentAnimation = "right";
    } else if (key === LEFT_ARROW) {
      this.currentAnimation = "left";
    }
  }

  keyReleased() {
    this.currentAnimation = "stand";
  }
}

class spriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = (this.flipped) ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);
    this.frameCount++;
    if (this.frameCount % 10 == 0) {
      this.u++;
    }
    if (this.u == this.startU + this.duration) {
      this.u = this.startU;
    }
  }
}