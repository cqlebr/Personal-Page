let bugs = [];
let score = 0;
let timer = 30;
let bugSprite;
let gameOver = false;
let frameIndex = 0;
let frameDelay = 10;
let frameCounter = 0;
let speedMultiplier = 1;

function preload() {
    bugSprite = loadImage('bugsprite.png'); // Load the sprite sheet
}

function setup() {
    createCanvas(600, 400);
    setInterval(() => { if (timer > 0) timer--; }, 1000); // Countdown timer
    
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1])));
    }
}

function draw() {
    background(220);
    
    if (timer <= 0) {
        gameOver = true;
        textSize(32);
        fill("black");
        text('Game Over!', width / 2 - 100, height / 2);
        text(`Score: ${score}`, width / 2 - 75, height / 2 + 40);
        textSize(18);
        text("Refresh to play the game again and compete to beat your high score!", width / 2 - 275, height / 2 + 80);
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
    text(`Score: ${score}`, 10, 20);
    text(`Time: ${timer}`, 10, 40);
}

function mousePressed() {
    for (let bug of bugs) {
        if (bug.isClicked(mouseX, mouseY) && !bug.squished) {
            bug.squish();
            score++;
            speedMultiplier += 0.1; // Increase speed when a bug is squished
            bugs.push(new Bug(random(width), random(height), random([-1, 1]), random([-1, 1]))); // Increase difficulty
        }
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
