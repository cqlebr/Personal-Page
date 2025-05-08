let bugs = [];
let score = 0;
let timer = 30;
let bugSprite;
let squishSound;
let skitterSound;
let gameStartSound;
let gameEndSound;
let gameMusic;
let reverb;
let gameOver = false;
let gameStarted = false;
let frameIndex = 0;
let frameDelay = 10;
let frameCounter = 0;
let speedMultiplier = 1;
let gameEndSoundPlayed = false;
let restartButton;
let reverbSlider, volumeSlider;

let port;
let connectButton;

// Joystick variables
let joystickX = 512;
let joystickY = 512;
let joystickBtn = 1;
let prevButtonState = 1;
let cursorX = 300;
let cursorY = 200;
let cursorImg;

// Joystick tuning
let deadZone = 100;
let centerX = 512;
let centerY = 512;
let sensitivity = 0.01;

function preload() {
    bugSprite = loadImage('bugsprite.png');
    squishSound = loadSound('Squish.mp3');
    skitterSound = loadSound('Skitter.mp3');
    gameStartSound = loadSound('GameStart.mp3');
    gameEndSound = loadSound('GameOver.mp3');
    gameMusic = loadSound('GameMusic.mp3');
    cursorImg = loadImage('cursor.png');
    reverb = new p5.Reverb();
}

function setup() {
    createCanvas(600, 400);
    let startButton = createButton('Start Game');
    startButton.position(width / 2 - 40, height / 2);
    startButton.mousePressed(() => {
        gameStarted = true;
        startButton.hide();
        gameStartSound.play();
        setInterval(() => { if (timer > 0) timer--; }, 1000);
        for (let i = 0; i < 5; i++) {
            bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1])));
        }
        startBackgroundMusic();
        reverbSlider.hide();
        volumeSlider.hide();
    });

    reverbSlider = createSlider(0, 1, 0.5, 0.01);
    reverbSlider.position(20, height / 2 + 50);
    reverbSlider.input(updateReverb);

    volumeSlider = createSlider(0, 1, 0.1, 0.01);
    volumeSlider.position(20, height / 2 + 100);
    volumeSlider.input(updateVolume);
    gameMusic.setVolume(volumeSlider.value());

    connectButton = createButton('Connect Arduino');
    connectButton.mousePressed(connect);
    port = createSerial();
    port.open('Arduino', 9600);
}

function draw() {
    background(220);

    // Read joystick serial input only if it includes commas
    let data = port.readUntil("\n");
    if (data.includes(",")) {
        let parts = data.trim().split(",");
        if (parts.length === 3) {
            joystickX = int(parts[0]);
            joystickY = int(parts[1]);
            joystickBtn = int(parts[2]);
        }
    }

    if (!gameStarted) {
        textSize(32);
        fill("black");
        textAlign(CENTER, CENTER);
        text('Bug Squish Game', width / 2, height / 2 - 50);
        textSize(18);
        text('Click the button to start!', width / 2, height / 2 - 20);
        textSize(16);
        text("Reverb", reverbSlider.x * 2 + reverbSlider.width, reverbSlider.y);
        text("Volume", volumeSlider.x * 2 + volumeSlider.width, volumeSlider.y);
        return;
    }

    if (timer <= 0) {
        gameOver = true;
        if (!gameEndSoundPlayed) {
            gameEndSound.play();
            gameEndSoundPlayed = true;
        }
        textSize(32);
        fill("black");
        textAlign(CENTER, CENTER);
        text('Game Over!', width / 2, height / 2);
        text(`Score: ${score}`, width / 2, height / 2 + 40);
        textSize(18);
        text("Click the button to restart!", width / 2, height / 2 + 80);
        if (!restartButton) {
            restartButton = createButton('Restart');
            restartButton.position(width / 2 - 40, height / 2 + 110);
            restartButton.mousePressed(() => {
                resetGame();
            });
        }
        return;
    }

    frameCounter++;
    if (frameCounter >= frameDelay) {
        frameIndex = (frameIndex + 1) % 2;
        frameCounter = 0;
    }

    for (let bug of bugs) {
        bug.move();
        bug.display();
    }

    // Joystick-controlled cursor movement with dead zone and sensitivity
    let deltaX = centerY - joystickY;
    let deltaY = centerX - joystickX;
    
    if (abs(deltaX) > deadZone) {
        cursorX += deltaX * sensitivity;
    }
    if (abs(deltaY) > deadZone) {
        cursorY += deltaY * sensitivity;
    }
    
    cursorX = constrain(cursorX, 0, width);
    cursorY = constrain(cursorY, 0, height);
    

    image(cursorImg, cursorX - 21, cursorY - 35, 42, 70); // Centered cursor

    // Handle joystick "click" press
    if (joystickBtn === 0 && prevButtonState === 1) {
        handleJoystickClick();
    }
    prevButtonState = joystickBtn;

    fill(0);
    textSize(16);
    text(`Score: ${score}`, 40, 20);
    text(`Time: ${timer}`, 40, 40);
    textSize(12);
    text(`Joystick: ${joystickX}, ${joystickY}, Btn: ${joystickBtn}`, 10, height - 10);

    if (timer > 15) port.write("G");
    else if (timer > 5) port.write("O");
    else port.write("R");
}

function mousePressed() {
    if (!gameStarted || gameOver) return;
    handleClick(mouseX, mouseY);
}

function handleJoystickClick() {
    handleClick(cursorX, cursorY);
}

function handleClick(x, y) {
    let bugClicked = false;
    for (let bug of bugs) {
        if (bug.isClicked(x, y) && !bug.squished) {
            bug.squish();
            score++;
            speedMultiplier += 0.1;
            bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1])));
            squishSound.play();
            port.write('S');
            bugClicked = true;
        }
    }
    if (!bugClicked) skitterSound.play();
}

class Bug {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 40;
        this.squished = false;
        this.rotation = atan2(dy, dx) + PI / 2;
    }

    move() {
        if (!this.squished) {
            this.x += this.dx * 2 * speedMultiplier;
            this.y += this.dy * 2 * speedMultiplier;
            this.rotation = atan2(this.dy, this.dx) + PI / 2;
            if (this.x < 0 || this.x > width) this.dx *= -1;
            if (this.y < 0 || this.y > height) this.dy *= -1;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        if (this.squished) {
            image(bugSprite, -this.size / 2, -this.size / 2, this.size, this.size, 0, 32, 32, 32);
        } else {
            image(bugSprite, -this.size / 2, -this.size / 2, this.size, this.size, frameIndex * 32, 0, 32, 32);
        }
        pop();
    }

    isClicked(mx, my) {
        return dist(mx, my, this.x, this.y) < this.size / 2;
    }

    squish() {
        this.squished = true;
    }
}

function startBackgroundMusic() {
    gameMusic.loop();
    reverb.process(gameMusic, 3, 2);
}

function updateReverb() {
    reverb.drywet(reverbSlider.value());
}

function updateVolume() {
    gameMusic.setVolume(volumeSlider.value());
}

function resetGame() {
    gameOver = false;
    gameStarted = true;
    score = 0;
    timer = 30;
    bugs = [];
    speedMultiplier = 1;
    gameEndSoundPlayed = false;
    restartButton.remove();
    restartButton = null;
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1])));
    }
}

function connect() {
    port.open('Arduino', 9600);
}
