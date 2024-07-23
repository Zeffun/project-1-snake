/*-------------------------------- Constants --------------------------------*/
const gridContainer = document.getElementById('gridContainer');
const gridSize = 30;
const cells = [];


// Initialize the grid
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
    cell.id = [i - (gridSize * Math.floor(i/gridSize)), -Math.floor(i/gridSize)];
    gridContainer.appendChild(cell);
    cells.push(cell);
}

//for each div grid that I add into the gridContainer div, I want to give it an additional class which will contain its 
//coordinates starting from (0,0), then everytime it reaches gridSize (i.e 20) on the x-axis, I restart the x-coordinates and add 1 to the y coordinates until I reach y = gridSize (i.e 20)


/*---------------------------- Variables (state) ----------------------------*/
let snakeHeadPosition = [10,-10];
let snakeDirection = "";
let movementIntervals;
let currentCell;
let snakeSegmentPositions = [];
let snakelength = 3;
let gameOver = false;
let foodPosition;

/*------------------------ Cached Element References ------------------------*/
const gameStartScreen = document.querySelector(".game-start");
const gameOverScreen = document.querySelector(".game-over");
const retryButton = document.querySelector("button");
const scoreText = document.querySelector(".score");

gameStartScreen.style.display = "initial";
gameOverScreen.style.display = "none";

/*-------------------------------- Functions --------------------------------*/
function makeFoodAppear() {
    //make food appear at random coordinates
    const allCells = document.querySelectorAll(".grid-item");
    let randomCellIndex = Math.floor(Math.random() * allCells.length);
    allCells[randomCellIndex].classList.add("food");
    foodPosition = allCells[randomCellIndex].id;
    console.log(foodPosition);
    //remove previous foods
    for(cell of allCells) {
        if(cell.id !== foodPosition) {
            cell.classList.remove("food");
        }
    };
};

makeFoodAppear();

function resetGame() {
    //reset the key variables
    snakeHeadPosition = [10,-10];
    snakeDirection = "";
    clearInterval(movementIntervals);
    currentCell = [10,-10];
    snakeSegmentPositions = [];
    snakelength = 3;
    gameOver = false;
    //clear the gameScreen visually
    const allCells = document.querySelectorAll(".grid-item");
    for(cell of allCells) {
        cell.classList.remove("snake");
    };
    //show the start screen and hide the game over screen
    gameStartScreen.style.display = "initial";
    gameOverScreen.style.display = "none";
}

function setGameOver() {
    clearInterval(movementIntervals);
    console.log("Game Over");
    gameOver = true;
    gameStartScreen.style.display = "none";
    gameOverScreen.style.display = "initial";
    scoreText.textContent = `Your score: ${(snakelength - 3) * 100}`;
}

function animateSnake() {
    //check for collisions with boundaries
    if(snakeHeadPosition[0] < 0 || 
        snakeHeadPosition[0] > (gridSize - 1)|| 
        snakeHeadPosition[1] > 0 ||
        snakeHeadPosition[1] < -(gridSize - 1)) {
            //gameover
            setGameOver();
    } else {
        //create the snake trailing animation
        currentCell = document.getElementById(snakeHeadPosition);
        currentCell.classList.add("snake");
        snakeSegmentPositions.unshift(currentCell);
        const otherCells = document.querySelectorAll(".grid-item");
        snakeSegmentPositions = snakeSegmentPositions.slice(0, snakelength);
        for(cell of otherCells) {
            if(snakeSegmentPositions.includes(cell)) {
                cell.classList.add("snake");
            } else {
                cell.classList.remove("snake");
            }
        };
        //check for collisions with own body
        for(segment of snakeSegmentPositions.slice(1)) {
            if(segment.id === snakeHeadPosition.toString()) {
                //gameover
                setGameOver();
            };
            
        };

        if(foodPosition === snakeHeadPosition.toString()) {
            makeFoodAppear();
            snakelength++;
        }
        //check for collisions with food
        // if( === snakeHeadPosition.toString()) {
        //     //gameover
        //     setGameOver();
        // }
    }
    
    
    

};

function moveSnake(e) {
    const key = e.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    //when up is pressed:
        //set snakeDirection = "up"
        //while loop for while snakeDirection === "up", the y coordinates increase by 1 at regular intervals
    if(!gameOver) {
        switch (e.key) {
            case "ArrowLeft":
                // Left pressed
                if(snakeDirection !== "right") { //this prevents the snake from reversing
                    snakeDirection = "left";
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[0] = snakeHeadPosition[0] - 1;
                        animateSnake();
                        
                    }, 100);
                };
                break;
            case "ArrowRight":
                // Right pressed
                if(snakeDirection !== "left") { //this prevents the snake from reversing
                    snakeDirection = "right";
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[0] = snakeHeadPosition[0] + 1;
                        animateSnake();
                    }, 100);
                };            
                break;
            case "ArrowUp":
                // Up pressed
                if(snakeDirection !== "down") { //this prevents the snake from reversing
                    snakeDirection = "up";
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[1] = snakeHeadPosition[1] + 1;
                        animateSnake();
                    }, 100);
                };
                break;
            case "ArrowDown":
                // Down pressed
                if(snakeDirection !== "up") { //this prevents the snake from reversing
                    snakeDirection = "down";
                    clearInterval(movementIntervals);
                    
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[1] = snakeHeadPosition[1] - 1;
                        animateSnake();
                    }, 100);
                };
                break;
        };
    
    };

    // while (snakeDirection === "left") {
    //     setTimeout(function() {
    //         snakeHeadPosition[0] = snakeHeadPosition[0] - 1;
    //         console.log(snakeHeadPosition);
    //     }, 100);
        
    // };

    //when down is pressed:
        //set snakeDirection = "down"
        //while loop for while snakeDirection === "down", the y coordinates decrease by 1 at regular intervals
    //when left is pressed:
        //set snakeDirection = "left"
        //while loop for while snakeDirection === "left", the x coordinates decrease by 1 at regular intervals
    //when right is pressed:
        //set snakeDirection = "right"
        //while loop for while snakeDirection === "right", the x coordinates increase by 1 at regular intervals

}



/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('keydown', moveSnake);
retryButton.addEventListener("click", resetGame);


//when I press an arrow key, I want the snake to move 1 step in that arrow key direction continually
//this should also update the CSS such that the green lights up wherever the position of the snakehead is i.e its CSS grid coordinates are updated
// 