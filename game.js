const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

// Set canvas size to full screen (portrait mode)
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Player and Blocks Scale Based on Screen Size
const playerSize = Math.min(canvas.width * 0.1, 50);
const blockSize = playerSize;

let player = { 
    x: canvas.width / 2 - playerSize / 2, 
    y: canvas.height - playerSize * 2, 
    width: playerSize, 
    height: playerSize, 
    speed: 5 
};

let blocks = [];
let score = 0;
let gameOver = false;
let touchStartX = 0;
let touchMoveX = 0;
let blockSpeed = 3;

// Initialize blocks
function createBlocks() {
    for (let i = 0; i < 4; i++) {
        blocks.push({
            x: Math.random() * (canvas.width - blockSize),
            y: -blockSize * i * 5,
            width: blockSize,
            height: blockSize
        });
    }
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBlocks() {
    ctx.fillStyle = "red";
    blocks.forEach(block => {
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

function moveBlocks() {
    blocks.forEach(block => {
        block.y += blockSpeed;

        if (block.y > canvas.height) {
            block.y = -blockSize;
            block.x = Math.random() * (canvas.width - blockSize);
            score++;
            blockSpeed += 0.05; // Increase speed over time
        }

        if (
            player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y
        ) {
            gameOver = true;
        }
    });
}

function update() {
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 50, canvas.height / 2 - 20);
        ctx.fillText("Score: " + score, canvas.width / 2 - 30, canvas.height / 2 + 10);
        restartBtn.style.display = "block";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBlocks();
    moveBlocks();
    requestAnimationFrame(update);
}

// Swipe Controls
canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", (e) => {
    touchMoveX = e.touches[0].clientX;
    let diff = touchMoveX - touchStartX;
    player.x += diff * 0.3; // Smoother movement
    touchStartX = touchMoveX;

    // Keep player inside boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
});

function restartGame() {
    gameOver = false;
    score = 0;
    blockSpeed = 3;
    player.x = canvas.width / 2 - playerSize / 2;
    blocks = [];
    createBlocks();
    restartBtn.style.display = "none";
    update();
}

// Start game
createBlocks();
update();
