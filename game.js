const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 500;

let player = { x: 140, y: 450, width: 20, height: 20, speed: 20 };
let blocks = [];
let gameOver = false;
let score = 0;

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
        block.y += 5;
        if (block.y > canvas.height) {
            block.y = -20;
            block.x = Math.random() * (canvas.width - 20);
            score++;
        }

        if (player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y) {
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
        ctx.fillText("Game Over!", 100, 250);
        ctx.fillText("Score: " + score, 120, 280);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBlocks();
    moveBlocks();
    requestAnimationFrame(update);
}

document.addEventListener("touchstart", (e) => {
    let touchX = e.touches[0].clientX;
    player.x = touchX - player.width / 2;
});

function initGame() {
    for (let i = 0; i < 3; i++) {
        blocks.push({ x: Math.random() * (canvas.width - 20), y: -20 * i * 10, width: 20, height: 20 });
    }
    update();
}

initGame();
