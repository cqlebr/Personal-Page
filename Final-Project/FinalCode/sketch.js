let ninja;
let character1;
let dashIcon;
let currentLevel = 0;
let timer = 60;
let gameOver = false;

let synth;
let bgmPart;
let levelCompleteOsc;

let gameState = "menu";
let startButton;

let port;
let connectButton;
let latestSerial = "";
let timerIntervalStarted = false;

let levels = [
  {
    walls: [
      // Top horizontal wall with secret passage
      { x: 0, y: 100, w: 400, h: 20, secretPass: { startX: 220, width: 60 } },

      // Second Top Wall
      {x: 400, y: 100, w: 400, h: 20, secretPass: { startX: 720, width: 60 } },

      // Left vertical wall
      { x: 100, y: 0, w: 20, h: 600, secretPass: { startY: 400, height: 60 } },

      // Right vertical wall
      { x: 660, y: 0, w: 20, h: 600, secretPass: { startY: 20, height: 60 } },

      // Middle vertical wall
      { x: 390, y: 0, w: 20, h: 600, secretPass: { startY : 20, height: 60 } },

      // Bottom horizontal wall
      { x: 100, y: 350, w: 700, h: 20, secretPass: { startX: 220, width: 60 } }
    ],
    goal: { x: 760, y: 275, w: 40, h: 50 },
    dashPickup: { x: 300, y: 300, size: 30 },
    bgColor: 220
  },
  {
      walls: [
        // Left Wall Top
        { x: 100, y: 0, w: 20, h: 150, secretPass: { startY: 30, height: 60 } },

        // Left Wall Middle 
        { x: 100, y: 150, w: 20, h: 150, secretPass: { startY: 160, height: 60} },

        // Left Wall Bottom
        { x: 100, y: 300, w: 20, h: 300, secretPass: { startY: 520, height: 60} },

        // Middle Wall
        { x: 400, y: 0, w: 20, h: 800, secretPass: { startY: 30, height: 60}},

        // Right Wall Top
        { x: 680, y: 0, w: 20, h: 150, secretPass: { startY: 30, height: 60 } },

        // Right Wall Middle 
        { x: 680, y: 150, w: 20, h: 150, secretPass: { startY: 160, height: 60} },
        
        // Right Wall Bottom
        { x: 680, y: 300, w: 20, h: 300, secretPass: { startY: 520, height: 60} },

        // Top Horizontal Wall 1
        { x: 0, y: 120, w: 400, h: 20, secretPass: { startX: 20, width: 60 } },

        // Top Horizontal Wall 2
        { x: 400, y: 120, w: 400, h: 20, secretPass: { startX: 720, width: 60} },

        // Middle Horizontal Wall 1
        { x: 0, y: 250, w: 400, h: 20, secretPass: { startX: 200, width: 60 } },

        // Middle Horizontal Wall 2
        { x: 400, y: 250, w: 400, h: 20, secretPass: { startX: 600, width: 60 } },

        // Bottom Horizontal Wall 1
        { x: 0, y: 480, w: 120, h: 20, secretPass: { startX: 20, width: 60 } },

        //Bottom Horizontal Wall 2
        { x: 120, y: 480, w: 280, h: 20, secretPass: { startX: 200, width: 60 } },

        //Bottom Horizontal Wall 3
        { x: 400, y: 480, w: 400, h: 20, secretPass: { startX: 600, width: 60 } }

      ],
    goal: { x: 750, y: 510, w: 40, h: 80 },
    dashPickup: null,
    bgColor: 220
  }
];

function preload() {
  ninja = loadImage("ninjasprite.png");
  dashIcon = loadImage("cloaktransparent.png");
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);

  connectButton = createButton('Connect Arduino');
  connectButton.mousePressed(connect);
  port = createSerial();
  
  startButton = createButton("Start Game");
  startButton.position(width / 2 - 50, height / 2);
  startButton.mousePressed(() => {
    gameState = "play";
    startButton.hide();
  
    if (!timerIntervalStarted) {
      setInterval(() => {
        if (gameState === "play" && timer > 0) {
          bgmPart.start();
          timer--;
          if (timer === 0) {
            gameState = "gameOver";
            bgmPart.stop();           // stop music
            playGameOverSound();      // play game over sound
          }
        }
      }, 1000);
      timerIntervalStarted = true;
    }
  });


  //synth = new p5.PolySynth();
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  // let melody = ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"];
  // let durations = [0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 1];
  
  // let phrase = new p5.Phrase("melody", (time, note) => {
  //   synth.play(note, 0.4, time, 0.5);
  // }, melody);

  // bgmPart = new p5.Part();
  // bgmPart.addPhrase(phrase);
  // bgmPart.setBPM(100);

  const melody = [
    { time: 0, note: "C4", velocity: 0.9 },
    { time: "0:1", note: "E4", velocity: 0.9 },
    { time: "0:2", note: "G4", velocity: 0.9 },
    { time: "0:3", note: "B4", velocity: 0.9 },
    { time: "1:0", note: "C5", velocity: 0.9 },
    { time: "1:1", note: "B4", velocity: 0.9 },
    { time: "1:2", note: "G4", velocity: 0.9 },
    { time: "1:3", note: "E4", velocity: 0.9 },
  ];
  
  const bgmPart = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
  }, melody).start(0);
  
  bgmPart.loop = true;
  bgmPart.loopEnd = "2m"; // Loop every 2 measures (adjust as needed)
  bgmPart.start(0);

  // levelCompleteOsc = new p5.Oscillator('sine');
  // levelCompleteOsc.amp(0);
  // levelCompleteOsc.start();

  levelCompleteOsc = new Tone.Oscillator().toDestination();
  levelCompleteOsc.volume.value = -Infinity;
  levelCompleteOsc.start();

  // const levelCompleteOsc = new Tone.Oscillator({
  //   type: "sine",
  //   frequency: 440,
  //   volume: -Infinity
  // }).toDestination().start();

  character1 = new Character(50, 320);
  character1.addAnimation("down", new spriteAnimation(ninja, 6, 5, 6));
  character1.addAnimation("up", new spriteAnimation(ninja, 0, 5, 6));
  character1.addAnimation("right", new spriteAnimation(ninja, 0, 0, 9));
  character1.addAnimation("left", new spriteAnimation(ninja, 0, 0, 9));
  character1.addAnimation("stand", new spriteAnimation(ninja, 0, 0, 1));
  character1.currentAnimation = "stand";
}

function draw() {
  if (port.available()) {
    latestSerial = port.readUntil('\n');
  }

  if (gameState === "menu") {
    background(20, 40, 60);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("Maze Escape ", width / 2, height / 2 - 100);
    textSize(18);
    text("Find your way through the secret passages!", width / 2, height / 2 - 50);
    textSize(32);
    text("Controls",width / 2 - 10, height / 2 + 60);
    textSize(16);
    text("WASD to move, the arduino button to search and scan for the secret passages", width / 2, height / 2 + 90);
    text("The LED lights on the board will tell you how close you are to the passage", width / 2, height/ 2 + 110);
    text("Red = far away, Yellow = Closer, Green = Really Close", width / 2, height / 2 + 130);
    return; 
  }

  if (gameState === "gameOver") {
    background(0);
    fill(255);
    textAlign(CENTER,CENTER);
    textSize(48);
    text("Game Over!", width / 2, height / 2 - 50);
    textSize(20);
    text("Press R to restart", width / 2, height / 2 + 10);
    return;
  }

  if (gameState === "gameWon") {
    background(0, 80, 0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("🎉 You Escaped! 🎉", width / 2, height / 2 - 50);
    textSize(20);
    text("Press R to play again", width / 2, height / 2 + 10);
    return;
  }


  let level = levels[currentLevel];
  let goal = level.goal;

  background(level.bgColor);

  for (let wall of level.walls) {
      // if (wall.secretPass) {
      //   fill(100);
      //   rect(wall.x,wall.y,wall.w,wall.h);
      //   if (wall.secretPass.startX) {
      //     fill(255,0,0,100);
      //     rect(wall.secretPass.startX, wall.y, wall.secretPass.width, wall.h);
      //   } else {
      //     fill(255,0,0,100);
      //     rect(wall.x,wall.secretPass.startY,wall.w, wall.secretPass.height);
      //   }
      // } else {
      // fill(100);
      // rect(wall.x, wall.y, wall.w, wall.h); 
      // }
      fill(100);
      rect(wall.x, wall.y, wall.w, wall.h); 
  }
  // Draw invisible goal area (green highlight for testing)
  fill(0, 255, 0, 100);
  rect(goal.x, goal.y, goal.w, goal.h);

  // Draw character with wall collision logic
  character1.draw(level.walls);


  for (let wall of level.walls) {
    if (wall.secretPass) {
      let proximity = 30;
      let isVertical = wall.h > wall.w;
      if (isVertical) {
        if (character1.x > wall.x - proximity && character1.x < wall.x + wall.w + proximity &&
          character1.y > wall.y && character1.y < wall.y + wall.h) {
            fill(0);
            textSize(16);
            textAlign(CENTER);
            //text("You feel a slight breeze...", width / 2, 40);
            //port.write("G");
      }
    } else {
      if (character1.y > wall.y - proximity && character1.y < wall.y + wall.h + proximity &&
        character1.x > wall.x && character1.x < wall.x + wall.w) {
          fill(0);
          textSize(16);
          textAlign(CENTER);
          //text("You feel a slight breeze...", width / 2, 40);
          //port.write("Y");
        }
      }
    }
  }

  if (latestSerial.trim() === "BUTTON") {
    let closestDistance = Infinity;
  
    for (let wall of level.walls) {
      if (!wall.secretPass) continue;
      let centerX, centerY;

      if (wall.h > wall.w) {
        // Vertical wall: passage runs along y-axis
        centerX = wall.x + wall.w / 2;
        centerY = wall.secretPass.startY + wall.secretPass.height / 2;
      } else {
        // Horizontal wall: passage runs along x-axis
        centerX = wall.secretPass.startX + wall.secretPass.width / 2;
        centerY = wall.y + wall.h / 2;
      }
      
      let dx = character1.x - centerX;
      let dy = character1.y - centerY;
      let dist = sqrt(dx * dx + dy * dy);
      if (dist < closestDistance) closestDistance = dist;
    }
  
    if (closestDistance < 50) {
      port.write("G\n");
    } else if (closestDistance < 100) {
      port.write("Y\n");
    } else {
      port.write("R\n");
    }
  
    latestSerial = ""; 
  }

  // Check for reaching goal
  if (character1.x > goal.x && character1.x < goal.x + goal.w &&
      character1.y > goal.y && character1.y < goal.y + goal.h) {
    nextLevel();
  }

  if (timer <= 0) {
    gameState = "gameOver";
    bgmPart.noLoop();
    //playGameOverSound();
    return;
  }
  drawText();
}

function playLevelCompleteSound() {
  const osc = new Tone.Oscillator(440, "sine").toDestination();
  osc.volume.value = -12;
  osc.start();
  osc.stop("+0.3"); // play for 0.3s
}

function playGameOverSound() {
  const osc = new Tone.Oscillator("C4", "sine").toDestination();
  osc.volume.value = -12;

  osc.start();

  // Create a quick descending pitch effect
  osc.frequency.rampTo("G3", 0.4);  // Drop in pitch over 0.4s
  osc.stop("+0.5");                 // Stop after 0.5s
}

function nextLevel() {
  currentLevel++;

  if (currentLevel >= levels.length) {
    gameState = "gameWon";
    if (bgmPart) bgmPart.stop();
    return;
  }

  character1.x = 50;
  character1.y = 350;
  character1.currentAnimation = "stand";
  timer = 60;
  playLevelCompleteSound();
}


function keyPressed() {
  if (gameState === "play") {
    character1.keyPressed(key);
  }

  if ((gameState === "gameOver" || gameState === "gameWon") && (key === 'r' || key === 'R')) {
    gameState = "menu";
    timer = 60;
    currentLevel = 0;
    character1.x = 50;
    character1.y = 350;
    character1.currentAnimation = "stand";
    startButton.show(); 
  }
}

function keyReleased() {
  character1.keyReleased();
}

function mousePressed() {
  Tone.start();
  if (Tone.Transport.state !== "started") {
    Tone.Transport.start();
  }
}

function drawText() {
  fill(0);
  textAlign(LEFT, TOP);
  textSize(16);
  text(`Time: ${timer}`, 10, 40);
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
    this.hasDash = false;
    this.isDashing = false;
    this.dashCooldown = 0;
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw(walls) {
    let animation = this.animations[this.currentAnimation];

    if (animation) {
      let nextX = this.x;
      let nextY = this.y;

      let speed = this.isDashing ? 6 : 2;
      if (this.dashCooldown > 0) this.dashCooldown--;
      if (this.isDashing && this.dashCooldown === 0) this.isDashing = false;

      switch (this.currentAnimation) {
        case "up":
          nextY -= speed;
          break;
        case "down":
          nextY += speed;
          break;
        case "right":
          nextX += speed;
          break;
        case "left":
          nextX -= speed;
          break;
      }
      let blocked = false;

      for (let wall of walls) {
        let isVertical = wall.h > wall.w;
      
        let inWall = nextX + 40 > wall.x &&
                     nextX - 40 < wall.x + wall.w &&
                     nextY + 40 > wall.y &&
                     nextY - 40 < wall.y + wall.h;
      
        let inSecret = false;

        if (wall.secretPass && inWall) {
          if (isVertical && wall.secretPass.startY !== undefined) {
            let sy = wall.secretPass.startY;
            let sh = wall.secretPass.height;
            inSecret = nextY + 40 > sy && nextY - 40 < sy + sh;
            } else if (!isVertical && wall.secretPass.startX !== undefined) {
              let sx = wall.secretPass.startX;
              let sw = wall.secretPass.width;
              inSecret = nextX + 40 > sx && nextX - 40 < sx + sw;
          }
        }
      
                     
      if (inWall && !inSecret) {
        blocked = true;
        break;
      }
    }             
       
      if (!blocked) {
        this.x = nextX;
        this.y = nextY;
      }
      this.x = constrain(this.x, 20, width - 20);
      this.y = constrain(this.y, 20, height - 20);
      

      // Draw character sprite
      push();
      translate(this.x, this.y);
      if (this.currentAnimation === "left") {
        scale(-1, 1);
      }
      animation.draw();
      pop();
    }
  }

  keyPressed(key) {
    if (key === 'w' || key === 'W') {
      this.currentAnimation = "up";
    } else if (key === 's' || key === 'S') {
      this.currentAnimation = "down";
    } else if (key === 'd' || key === 'D') {
      this.currentAnimation = "right";
    } else if (key === 'a' || key === 'A') {
      this.currentAnimation = "left";
    }
    if ((key === 'Shift' || keyCode === SHIFT) && this.hasDash && this.dashCooldown === 0) {
      this.isDashing = true;
      this.dashCooldown = 60;
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
    if (this.frameCount % 10 === 0) {
      this.u++;
    }
    if (this.u === this.startU + this.duration) {
      this.u = this.startU;
    }
  }
}

function connect() {
  port.open('Arduino', 9600);
}
