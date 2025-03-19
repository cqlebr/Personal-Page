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
let gameEndSoundPlayed = false; // Prevent multiple plays
let restartButton;
let reverbSlider, volumeSlider;

// Load audio effects and game music
function preload() {
    bugSprite = loadImage('bugsprite.png'); // Load the sprite sheet
    squishSound = loadSound('Squish.mp3'); // Load the squish sound effect
    skitterSound = loadSound('Skitter.mp3'); // Load the miss sound effect
    gameStartSound = loadSound('GameStart.mp3'); // Load the game start sound effect
    gameEndSound = loadSound('GameOver.mp3'); // Load the game end sound effect
    gameMusic = loadSound('GameMusic.mp3'); // Load the background music

    // Create reverb effect
    reverb = new p5.Reverb();
}

function setup() {
    createCanvas(600, 400);
    let startButton = createButton('Start Game');
    startButton.position(width / 2 - 40, height / 2);
    startButton.mousePressed(() => {
        gameStarted = true;
        startButton.hide();
        gameStartSound.play(); // Play game start sound
        setInterval(() => { if (timer > 0) timer--; }, 1000); // Countdown timer
        for (let i = 0; i < 5; i++) {
            bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1])));
        }
        startBackgroundMusic();
        // Hide sliders when game starts
        reverbSlider.hide();
        volumeSlider.hide();
    });

    // Slider for controlling reverb
    reverbSlider = createSlider(0, 1, 0.5, 0.01);
    reverbSlider.position(20, height / 2 + 50);
    reverbSlider.input(updateReverb);

    // Slider for controlling volume
    volumeSlider = createSlider(0, 1, 0.1, 0.01); // Set volume slider default to 10% (0.1)
    volumeSlider.position(20, height / 2 + 100);
    volumeSlider.input(updateVolume);
    gameMusic.setVolume(volumeSlider.value()); // Apply the initial volume (10%)
}

function draw() {
    background(220);

    if (!gameStarted) {
        textSize(32);
        fill("black");
        textAlign(CENTER, CENTER);
        text('Bug Squish Game', width / 2, height / 2 - 50);
        textSize(18);
        text('Click the button to start!', width / 2, height / 2 - 20);

        // Display the sliders
        textSize(16);
        text("Reverb", reverbSlider.x * 2 + reverbSlider.width, reverbSlider.y);
        text("Volume", volumeSlider.x * 2 + volumeSlider.width, volumeSlider.y);
        return;
    }

    if (timer <= 0) {
        gameOver = true;
        if (!gameEndSoundPlayed) {
            gameEndSound.play(); // Play game end sound once
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

    fill(0);
    textSize(16);
    text(`Score: ${score}`, 40, 20);
    text(`Time: ${timer}`, 40, 40);
}

function mousePressed() {
    if (!gameStarted || gameOver) return;
    let bugClicked = false;
    for (let bug of bugs) {
        if (bug.isClicked(mouseX, mouseY) && !bug.squished) {
            bug.squish();
            score++;
            speedMultiplier += 0.1; // Increase speed when a bug is squished
            bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1]))); // Increase difficulty
            squishSound.play(); // Play squish sound effect
            bugClicked = true;

            if (score % 5 === 0) {
                tempo += 10;
                Tone.Transport.bpm.value = tempo;
            }
        }
    }
    if (!bugClicked) {
        skitterSound.play(); // Play skitter sound when a miss occurs
    }
}

class Bug {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 40;
        this.squished = false;
        this.rotation = atan2(dy, dx) + PI / 2; // Adjust rotation
    }

    move() {
        if (!this.squished) {
            this.x += this.dx * 2 * speedMultiplier;
            this.y += this.dy * 2 * speedMultiplier;
            this.rotation = atan2(this.dy, this.dx) + PI / 2; // Adjust rotation to align with bug's movement

            if (this.x < 0 || this.x > width) this.dx *= -1;
            if (this.y < 0 || this.y > height) this.dy *= -1;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        if (this.squished) {
            image(bugSprite, -this.size / 2, -this.size / 2, this.size, this.size, 0, 32, 32, 32); // Dead frame
        } else {
            image(bugSprite, -this.size / 2, -this.size / 2, this.size, this.size, frameIndex * 32, 0, 32, 32); // Flying animation
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
    reverb.process(gameMusic, 3, 2); // Set reverb
}

function updateReverb() {
    let reverbValue = reverbSlider.value();
    reverb.drywet(reverbValue); // Update reverb level
}

function updateVolume() {
    let volumeValue = volumeSlider.value();
    gameMusic.setVolume(volumeValue); // Update game music volume
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
