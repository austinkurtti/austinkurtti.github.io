var init;

// canvas variables
var canvas, context, canvasHeight, canvasWidth;

// game variables
var cellWidth = 10,
    gameLoop, direction, food, score, snakeArray;

// give canvas variables values when ready
$(document).ready(function() {
    canvas = $("#snake-canvas")[0];
    context = canvas.getContext("2d");
    canvasHeight = $("#snake-canvas").height();
    canvasWidth = $("#snake-canvas").width();
});

function gameOver() {
    clearInterval(gameLoop);
}

function createSnake(length) {
    snakeArray = [];
    for(var i = length; i > 0; i--) {
        snakeArray.push({x: i, y: 0});
    }
}

function createFood() {
    food = {
        x: Math.round(Math.random()*(canvasWidth-cellWidth)/cellWidth),
        y: Math.round(Math.random()*(canvasHeight-cellWidth)/cellWidth)
    };
}

function paint() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, canvasWidth, canvasHeight);

    var nextX = snakeArray[0].x;
    var nextY = snakeArray[0].y;

    switch(direction) {
        case "up":
            nextY--;
        break;
        case "right":
            nextX++;
        break;
        case "down":
            nextY++;
        break;
        case "left":
            nextX--;
        break;
    }

    if(nextX == -1 || nextX == canvasWidth/cellWidth || nextY == -1 || nextY == canvasHeight/cellWidth || checkCollision(nextX, nextY, snakeArray)) {
        gameOver();
        return;
    }

    if(nextX == food.x && nextY == food.y) {
        var tail = {x: nextX, y: nextY};
        score++;
        createFood();
    }
    else {
        var tail = snakeArray.pop();
        tail.x = nextX; tail.y = nextY;
    }

    snakeArray.unshift(tail);

    for(var i = 0; i < snakeArray.length; i++) {
        var cell = snakeArray[i];
        paintCell(cell.x, cell.y);
    }

    paintCell(food.x, food.y);
    var scoreText = "Score: " + score;
    context.fillText(scoreText, 5, canvasHeight-5);
}

function paintCell(x, y) {
    context.fillStyle = "blue";
    context.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    context.strokeStyle = "white";
    context.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
}

function checkCollision(x, y, array) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].x == x && array[i].y == y) {
            return true;
        }
    }
    return false;
}

$(document).keydown(function(e) {
    var key = e.which;

    if(key == "37" && direction != "right") {
        direction = "left";
    }
    else if(key == "38" && direction != "down") {
        direction = "up";
    }
    else if(key == "39" && direction != "left") {
        direction = "right";
    }
    else if(key == "40" && direction != "up") {
        direction = "down";
    }
});

function init() {
    direction = "right";
    createSnake(5);
    createFood();
    score = 0;
    
    gameLoop = setInterval(paint, 60);
}