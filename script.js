const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, apple, direction, appleDirection, gameOver, gameInterval, level, inverted, appleMoving, appleSpeed;

function resetGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    apple = getFarAwayPosition();
    direction = "RIGHT";
    appleDirection = "RIGHT";
    gameOver = false;
    level = 1;
    inverted = false;
    appleMoving = false;
    appleSpeed = 2;
    document.body.style.backgroundColor = "#222";
}

function startGame() {
    resetGame();
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 150);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    let key = event.key.toLowerCase();

    if (level === 4) {
        if ((key === "arrowleft" || key === "a") && appleDirection !== "RIGHT") appleDirection = "LEFT";
        else if ((key === "arrowup" || key === "w") && appleDirection !== "DOWN") appleDirection = "UP";
        else if ((key === "arrowright" || key === "d") && appleDirection !== "LEFT") appleDirection = "RIGHT";
        else if ((key === "arrowdown" || key === "s") && appleDirection !== "UP") appleDirection = "DOWN";
    } else {
        if (inverted) {
            if ((key === "arrowleft" || key === "a") && direction !== "LEFT") direction = "RIGHT";
            else if ((key === "arrowup" || key === "w") && direction !== "UP") direction = "DOWN";
            else if ((key === "arrowright" || key === "d") && direction !== "RIGHT") direction = "LEFT";
            else if ((key === "arrowdown" || key === "s") && direction !== "DOWN") direction = "UP";
        } else {
            if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
            else if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
            else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
            else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
        }
    }
}

function draw() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
        clearInterval(gameInterval);

        if (level === 4) {
            document.getElementById("gameOverAudio").play();
        }
        return;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x, apple.y, box, box);

    ctx.fillStyle = level >= 2 ? "cyan" : "lime";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (level === 4) {
        moveApple();
        if (apple.x < snakeX) snakeX -= box;
        else if (apple.x > snakeX) snakeX += box;
        if (apple.y < snakeY) snakeY -= box;
        else if (apple.y > snakeY) snakeY += box;
    } else {
        if (direction === "LEFT") snakeX -= box;
        if (direction === "RIGHT") snakeX += box;
        if (direction === "UP") snakeY -= box;
        if (direction === "DOWN") snakeY += box;
    }

    snakeX = (snakeX + canvas.width) % canvas.width;
    snakeY = (snakeY + canvas.height) % canvas.height;

    if (snakeX === apple.x && snakeY === apple.y) {
        if (level < 4) {
            level++;
            if (level === 2) {
                inverted = true;
                startColorChange();
            } else if (level === 3) {
                inverted = false;
                stopColorChange();
                appleMoving = true;
                moveAppleForSeconds(5);
            } else if (level === 4) {
                appleSpeed = 3;
                apple = getFarAwayPosition();
            }
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };
    if (collision(newHead, snake)) gameOver = true;
    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Level: " + level, 10, 20);
}

function moveApple() {
    if (appleMoving) {
        let appleX = apple.x;
        let appleY = apple.y;

        if (appleDirection === "LEFT") appleX -= box;
        if (appleDirection === "RIGHT") appleX += box;
        if (appleDirection === "UP") appleY -= box;
        if (appleDirection === "DOWN") appleY += box;

        apple.x = (appleX + canvas.width) % canvas.width;
        apple.y = (appleY + canvas.height) % canvas.height;
    }
}

function moveAppleForSeconds(seconds) {
    let moveInterval = setInterval(() => {
        apple = getFarAwayPosition();
    }, 500);

    setTimeout(() => {
        clearInterval(moveInterval);
        appleMoving = false;
    }, seconds * 1000);
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function getFarAwayPosition() {
    let pos;
    do {
        pos = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } while (collision(pos, snake));
    return pos;
}

function startColorChange() {
    setInterval(() => document.body.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`, 1000);
}

function stopColorChange() {
    document.body.style.backgroundColor = "#222";
}
