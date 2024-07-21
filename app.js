/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/
let snakeHeadPosition = [0,0];
let snakeDirection = "";

/*------------------------ Cached Element References ------------------------*/


/*-------------------------------- Functions --------------------------------*/
function moveSnake(e) {
    const key = e.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    //when up is pressed:
        //set snakeDirection = "up"
        //while loop for while snakeDirection === "up", the y coordinates increase by 1 at regular intervals
    switch (e.key) {
        case "ArrowLeft":
            // Left pressed
            snakeDirection = "left";
            console.log(snakeDirection);
            break;
        case "ArrowRight":
            // Right pressed
            snakeDirection = "right";
            console.log(snakeDirection);
            setInterval(function() {
                snakeHeadPosition[0] = snakeHeadPosition[0] + 1;
                console.log(snakeHeadPosition);
            }, 1000);
            break;
        case "ArrowUp":
            // Up pressed
            snakeDirection = "up";
            console.log(snakeDirection);
            setInterval(function() {
                snakeHeadPosition[1] = snakeHeadPosition[1] + 1;
                console.log(snakeHeadPosition);
            }, 1000);
            break;
        case "ArrowDown":
            // Down pressed
            snakeDirection = "down";
            console.log(snakeDirection);
            setInterval(function() {
                snakeHeadPosition[1] = snakeHeadPosition[1] - 1;
                console.log(snakeHeadPosition);
            }, 1000);
            break;
    };

    // while (snakeDirection === "left") {
    //     setTimeout(function() {
    //         snakeHeadPosition[0] = snakeHeadPosition[0] - 1;
    //         console.log(snakeHeadPosition);
    //     }, 1000);
        
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


//when I press an arrow key, I want the snake to move 1 step in that arrow key direction continually
//this should also update the CSS such that the green lights up wherever the position of the snakehead is i.e its CSS grid coordinates are updated
// 