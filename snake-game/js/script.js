const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLength = 0;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gameMusic = new Audio('./music/gameMusic.mp3');
gameMusic.volume = 0.1;
gameMusic.loop = true;

function drawGame() {
    changeSnakePosition();
    const result = isGameOver();

    if (result) {
        return;
    }

    clearScreen();

    checkAppleCollision();
    drawApple();
    drawSnake();

    drawScore();

    if (score >= 5) {
        speed = 16;
    } else if (score >= 10) {
        speed = 19;
    } else if (score >= 20) {
        speed = 22;
    } else if (score >= 40) {
        speed = 25;
    } else {
        speed = 13;
    }

    setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Walls
    if (headX < 0) {
        gameOver = true;
    } else if (headX === tileCount) {
        gameOver = true;
    } else if (headY < 0) {
        gameOver = true;
    } else if (headY === tileCount) {
        gameOver = true;
    }

    for (let i = 0; i < snakeParts.length; i++) {
        const part = snakeParts[i];

        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        context.fillStyle = 'hsl(255, 100%, 90%)';
        context.font = '50px Poppins';

        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        
        gradient.addColorStop('0', 'magenta');
        gradient.addColorStop('0.5', 'blue');
        gradient.addColorStop('1.0', 'red');

        context.fillStyle = gradient;

        context.fillText('Game Over!', canvas.width / 8, canvas.height / 2);

        document.body.addEventListener('keydown', (e) => {
            if (e.keyCode == 32) {
                window.location.reload();
            }
        });
    }

    if (gameOver) {
        context.fillStyle = 'hsl(255, 100%, 90%)';
        context.font = '18px Poppins';
        context.fillText('Press "Space" to RESTART', canvas.width / 5, canvas.height / 1.5);
    }

    return gameOver;
}

function drawScore() {
    context.fillStyle = 'hsl(255, 100%, 90%)';
    context.font = '10px Poppins';
    context.fillText('Score: ' + score, canvas.width - 65, 20);
}

function clearScreen() {
    context.fillStyle = 'hsl(255, 0%, 0%)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawApple() {
    context.fillStyle = 'hsl(235, 65%, 50%)';
    context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if (appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

function drawSnake() {
    // Start Music Playing
    gameMusic.play();

    context.fillStyle = 'green';

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];

        context.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY));

    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    context.fillStyle = 'hsl(255, 100%, 100%)'; // Color of snake head
    context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
    headX += xVelocity;
    headY += yVelocity;
}

document.body.addEventListener('keydown', keyDown);

function keyDown(e) {
    if (e.keyCode == 38) {
        // Key Up
        if (yVelocity == 1) return;
        yVelocity = -1;
        xVelocity = 0;
    } else if (e.keyCode == 40) {
        // Key Down
        if (yVelocity == -1) return;
        yVelocity = 1;
        xVelocity = 0;
    } else if (e.keyCode == 37) {
        // Key Left
        if (xVelocity == 1) return;
        yVelocity = 0;
        xVelocity = -1;
    } else if (e.keyCode == 39) {
        // Key right
        if (xVelocity == -1) return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

drawGame();