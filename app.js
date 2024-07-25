/*-------------------------------- Variables & Initialisations--------------------------------*/
//Grid 
const gridContainer = document.getElementById('gridContainer');
const gridSize = 35;
const cells = [];
//SFX
const eatFoodSFX = new Audio("./eatFoodSFX.wav");
const loseSFX = new Audio("./loseSFX.wav");
const backgroundSFX = new Audio("./backgroundSFX.mp3");
const turnHorizontalSFX = new Audio("./turnHorizontalSFX.mp3");
const turnVerticalSFX = new Audio("./turnVerticalSFX.mp3");
turnHorizontalSFX.volume = 0.3;
turnVerticalSFX.volume = 0.3;
//Gameplay
let snakeHeadPosition = [10,-10];
let snakeDirection = "";
let movementIntervals;
let currentCell;
let snakeSegmentPositions = [];
const snakeStartingLength = 3;
const scoreMultipler = 100;
let snakelength = snakeStartingLength;
let snakeFrameRate = 100;
let gameOver = false;
let foodPosition;
//Cached Element References
const gameStartScreen = document.querySelector(".game-start");
const gameOverScreen = document.querySelector(".game-over");
const retryButton = document.querySelector("button");
const scoreText = document.querySelector(".score");
gameStartScreen.style.display = "initial";
gameOverScreen.style.display = "none";

/*-------------------------------- Functions and Function Calls --------------------------------*/
//Create the game grid
function createGameGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');
        cell.id = [i - (gridSize * Math.floor(i/gridSize)), -Math.floor(i/gridSize)];
        gridContainer.appendChild(cell);
        cells.push(cell);
    };
};

createGameGrid(); //Call the grid-creating function at the start so that the grid is drawn

//Make food appear at a random grid cell
function makeFoodAppear() {
    //Setting the random position of the food
    const allCells = document.querySelectorAll(".grid-item");
    let randomCellIndex = Math.floor(Math.random() * allCells.length);
    //Ensure that the food does not appear at the same cell as the snake
    for(segment of snakeSegmentPositions) {
        while(segment === allCells[randomCellIndex]) {
            randomCellIndex = Math.floor(Math.random() * allCells.length);
        };
    };
    //If the randomised cell position doesn't overlap with where the snake is, add CSS food styling to it and set foodPosition to that cell
    allCells[randomCellIndex].classList.add("food");
    foodPosition = allCells[randomCellIndex].id;
    //remove the previous food CSS styling to make it look like the previous food has disappeared
    for(cell of allCells) {
        if(cell.id !== foodPosition) {
            cell.classList.remove("food");
        }
    };
};

makeFoodAppear(); //Call the food randomising function at the start so that the player has an initial goal

//Reset the game for when the player clicks the retry button after losing
function resetGame() {
    //reset the key variables
    snakeHeadPosition = [10,-10];
    snakeDirection = "";
    clearInterval(movementIntervals);
    currentCell = [10,-10];
    snakeSegmentPositions = [];
    snakelength = snakeStartingLength;
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

//Change the game state when the player loses
function setGameOver() {
    //stop the snake from moving
    gameOver = true;
    clearInterval(movementIntervals); 
    //Change the display to show the gameover screen and player's score
    gameOverScreen.style.display = "initial";
    scoreText.textContent = `Your score: ${(snakelength - snakeStartingLength) * scoreMultipler}`;
    //Gameover SFX
    loseSFX.play();
    backgroundSFX.pause();
    backgroundSFX.currentTime = 0;
}

//Animate the movement of the snake
function animateSnake() {
    //check for collisions with boundaries
    if(snakeHeadPosition[0] < 0 || 
        snakeHeadPosition[0] > (gridSize - 1)|| 
        snakeHeadPosition[1] > 0 ||
        snakeHeadPosition[1] < -(gridSize - 1)) {
            //gameover
            setGameOver();
            
    };   
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
        };
    };
    
    //check for collisions with own body
    for(segment of snakeSegmentPositions.slice(1)) {
        if(segment.id === snakeHeadPosition.toString()) {
            //gameover 
            setGameOver();
        };
        
    };
    //check for collisions with food
    if(foodPosition === snakeHeadPosition.toString()) {
        //Make the food appear somewhere else
        makeFoodAppear();
        //Increase the snake's length by 1
        snakelength++;
        //this and the next lines fixe the audio bug where new audio doesn't play if old audio is still playing (found solution on stack overflow, still need to figure out how it works)
        eatFoodSFX.pause(); 
        eatFoodSFX.currentTime = 0;
        eatFoodSFX.play();
    }; 

};

//Control the movement of the snake
function moveSnake(e) {
    //Store the key pressed by the player
    const key = e.key; 
    if(!gameOver) {
        //when player first presses an arrow key, remove the start screen
        if(key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
            gameStartScreen.style.display = "none";
            backgroundSFX.play();
        }
        //setting the snake's movement and SFX for each key press
        switch (e.key) {
            case "ArrowLeft":
                // Left pressed
                if(snakeDirection !== "right" && snakeDirection !== "left") { //this prevents the snake from reversing
                    snakeDirection = "left";
                    snakeHeadPosition[0]--;
                    animateSnake();
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[0] = snakeHeadPosition[0] - 1;
                        animateSnake();
                        
                    }, snakeFrameRate);
                    turnVerticalSFX.pause(); //this and the next line fixes the audio bug where new audio doesn't play if old audio is still playing (found solution on stack overflow, still need to figure out how it works)
                    turnVerticalSFX.currentTime = 0;
                    turnHorizontalSFX.play();
                };
                break;
            case "ArrowRight":
                // Right pressed
                if(snakeDirection !== "left" && snakeDirection !== "right") { //this prevents the snake from reversing
                    snakeDirection = "right";
                    snakeHeadPosition[0]++;
                    animateSnake();
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[0] = snakeHeadPosition[0] + 1;
                        animateSnake();
                    }, snakeFrameRate);
                    turnVerticalSFX.pause(); //this and the next line fixes the audio bug where new audio doesn't play if old audio is still playing (found solution on stack overflow, still need to figure out how it works)
                    turnVerticalSFX.currentTime = 0;
                    turnHorizontalSFX.play();
                };            
                break;
            case "ArrowUp":
                // Up pressed
                if(snakeDirection !== "down" && snakeDirection !== "up") { //this prevents the snake from reversing
                    snakeDirection = "up";
                    snakeHeadPosition[1]++;
                    animateSnake();
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[1] = snakeHeadPosition[1] + 1;
                        animateSnake();
                    }, snakeFrameRate);
                    turnHorizontalSFX.pause(); //this and the next line fixes the audio bug where new audio doesn't play if old audio is still playing (found solution on stack overflow, still need to figure out how it works)
                    turnHorizontalSFX.currentTime = 0;
                    turnVerticalSFX.play();
                };
                break;
            case "ArrowDown":
                // Down pressed
                if(snakeDirection !== "up" && snakeDirection !== "down") { //this prevents the snake from reversing
                    snakeDirection = "down";
                    snakeHeadPosition[1]--;
                    animateSnake();
                    clearInterval(movementIntervals);
                    movementIntervals = setInterval(function() {
                        snakeHeadPosition[1] = snakeHeadPosition[1] - 1;
                        animateSnake();
                    }, snakeFrameRate);
                    turnHorizontalSFX.pause(); //this and the next line fixes the audio bug where new audio doesn't play if old audio is still playing (found solution on stack overflow, still need to figure out how it works)
                    turnHorizontalSFX.currentTime = 0;
                    turnVerticalSFX.play();
                };
                break;
        };
    
    };
};

/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('keydown', moveSnake);
retryButton.addEventListener("click", resetGame);