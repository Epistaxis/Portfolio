
let pixelSize = 10 ;
// let aliveColor = "#2196f3";
let aliveColor = 0;
// let backGround = "#031321";
let backGround = 255;
let gridColor = 200;
let fps = 20;
let mReleased = true;
let looping = true; 
let resizeValue = 0.5;
let forwardTime;
let pause = false;
let drawOnce = false;
let delayKey = 500; 
let theMatrix = new Array(0);
let timeDirection = "forward";


function makeMatrix(x, y) {
    let matrix = new Array(x);
    for (let i = 0 ; i < x ; i++) {
        matrix[i] = new Array(y);
        for (let j = 0 ; j < y ; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

function matrixRnd(matrix, cols, rows) {
    for (let i = 1; i < (cols-1); i++) {
        for (let j = 1; j < (rows-1); j++) {
            matrix[i][j] = floor(random(2))
        }
    }
    return matrix;
}

function drawGrid (cols, rows) {
    stroke(gridColor);
    for (let i = 0; i < cols; i++) {
        line(i * pixelSize, 0, i * pixelSize, rows * pixelSize);
    }
    for (let j = 0; j < rows; j++) {
        line(0, j * pixelSize, cols * pixelSize, j * pixelSize);
    }
}

function drawRect(matrix, cols, rows) {
    image(backgroundGrid, 0, 0);
    if (pixelSize > 4) {
        stroke(backGround);
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            // console.log(i + ' ' + j + ' ' + matrix[i][j]);
            if (matrix[i][j] == 1) {
                // stroke(backGround);
                fill(aliveColor);
                rect(i*pixelSize, j*pixelSize, pixelSize - 1, pixelSize - 1);
            }
        }
    }         
}

    function sommexy(grid, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
            }
        }
        sum -= grid[x][y];
        return sum;
    } 

function update(matrix0, cols, rows) {
    cols = matrix0.length;
    rows = matrix0[0].length;
    let matrix1 = makeMatrix(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            let somme = sommexy(matrix0, i, j);
            state = matrix0 [i][j];

            if (state == 0 && somme == 3) {
                matrix1 [i][j] = 1;
            }
            else if (state == 1 && (somme < 2 || somme > 3) ) {
                matrix1 [i][j] = 0;
            }
            else {
                matrix1 [i][j] = state;
            }
        }
    }
    matrix0 = matrix1.slice();
    theMatrix.push(matrix0);
}

function drawTime(){
    let time = theMatrix.length - 1
    console.log(time)
    stroke(255);
    strokeWeight(16);
    textSize((cols/2) / (cols/40));
    text(time, 20, 40);
    fill(100,100,100);
    strokeWeight(2);
}

function addCell(matrix0) {
    matrix0[Math.floor(mouseX/pixelSize)][Math.floor(mouseY/pixelSize)] = 1;
    matrix0[Math.floor(mouseX/pixelSize)][Math.floor(mouseY/pixelSize)] = 1;

    stroke(backGround);
    fill(aliveColor);
    rect(Math.floor(mouseX/pixelSize)*pixelSize, Math.floor(mouseY/pixelSize)*pixelSize, pixelSize - 1, pixelSize - 1);
}

function mousePressed() {
    mReleased = false;
    addCell(theMatrix[theMatrix.length - 1]);
}

function mouseDragged() {
    if (mouseIsPressed) {
        addCell(theMatrix[theMatrix.length - 1]);
    }

}

function mouseReleased() {
    mReleased = true;
}

function keyPressed() {

    // E 
    if (keyCode === 69 || keyCode === RIGHT_ARROW) {
        drawOnce = true;
        timeDirection = "forward";
        console.log(timeDirection);
        redraw();
        forwardTime = new Date().getTime();
    }

    // Z 
    if (keyCode === 90) {
        pause = !(pause);
    }

    // A 
    if (keyCode === 65 || keyCode === LEFT_ARROW) {
        drawOnce = true;
        timeDirection = "backward";
        console.log(timeDirection);
        redraw();
        forwardTime = new Date().getTime();
    }

    // Q
    if (keyCode === 81) {
        theMatrix[theMatrix.length - 1] = makeMatrix(cols, rows);
        drawRect(theMatrix[theMatrix.length - 1], cols, rows);
        pause = true;
    }
}


function setup() {
    // var cnv = createCanvas(cols*pixelSize, rows*pixelSize);

    let wW = 0.655 * windowWidth;
    let wH = 0.75 * windowHeight;

    background(0);
    frameRate(fps);

    cols = Math.floor(wW/pixelSize);
    rows = Math.floor(wH/pixelSize);

    var cnv = createCanvas(wW - resizeValue, wH - resizeValue);
    cnv.style('display', 'block');
    cnv.parent("sketch-holder");

    matrixEmpty = makeMatrix(cols, rows) ;
    matrixOne = matrixRnd(makeMatrix(cols, rows), cols, rows);
    theMatrix.push(matrixOne);

    backgroundGrid = createGraphics(wW - resizeValue, wH - resizeValue);
    backgroundGrid.background(255);

        backgroundGrid.stroke(gridColor);
        for (let i = 0; i < cols; i++) {
            backgroundGrid.line(i * pixelSize, 0, i * pixelSize, rows * pixelSize);
        }
        for (let j = 0; j < rows; j++) {
            backgroundGrid.line(0, j * pixelSize, cols * pixelSize, j * pixelSize);
        }
    
    drawRect(matrixEmpty, cols, rows); 
}

function draw() {

    console.log(theMatrix.length)
    if (timeDirection === "forward") {
        if (!pause || drawOnce) {
            update(theMatrix[theMatrix.length - 1], cols, rows);
            drawRect(theMatrix[theMatrix.length - 1], cols, rows);
            drawOnce = false;
        }
    
        else if ((keyIsDown(69) || keyIsDown(RIGHT_ARROW)) && ((new Date().getTime())) - forwardTime > delayKey ) {
            update(theMatrix[theMatrix.length - 1], cols, rows);
            drawRect(theMatrix[theMatrix.length - 1], cols, rows);
        } 
    }

    else if (timeDirection === "backward") {
        if ( theMatrix.length > 1) {
        if (!pause || drawOnce) {
            theMatrix.pop();
            drawRect(theMatrix[theMatrix.length - 1], cols, rows);
            drawOnce = false;
        }
    
        else if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && ((new Date().getTime())) - forwardTime > delayKey) {
            theMatrix.pop();
            drawRect(theMatrix[theMatrix.length - 1], cols, rows);
        } 
    }
    }
    drawTime();
}
