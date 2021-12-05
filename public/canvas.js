 //Intro
// tool.beginPath(); //new graphic (path) line
// tool.moveTo(10,10); //start point
// tool.lineTo(100,150); //end point
// tool.stroke(); //fill graphic (color)
//-------------------------begin----------------------------------
let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let penColorCont = document.querySelectorAll(".pencil-color");
let penWidthElem = document.querySelector(".pen-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".down");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
let mouseFlag = false;

let penColor = "red";
let eraserColor = "white";
let penWidth = penWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let undoRedoTracker = [];
let track = 0;

let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener("mousedown", (e) => {
    mouseFlag = true;
    let data = {
        x: e.clientX,
        y: e.clientY              
    }
    
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
    if(mouseFlag){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth                              
        }

        socket.emit("drawStroke", data); 
    }          
})

canvas.addEventListener("mouseup", (e) => {
    mouseFlag = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

undo.addEventListener("click", (e) => {
    if(track > 0){
        track--;
    }
    //track action
    let data = {
        trackValue : track,
        undoRedoTracker
    }

    socket.emit("undoRedo", data);
})

redo.addEventListener("click", (e) => {
    if(track < undoRedoTracker.length - 1){
        track++;
    }

    //track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    
    socket.emit("undoRedo", data);
}) 

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;   //getting the track value number
    undoRedoTracker = trackObj.undoRedoTracker; //getting the object array

    let url = undoRedoTracker[track]; //getting the url of the track in the object
    let img = new Image();  //new img reference element
    img.src = url; //assigning url to the img source to be undo or redo
    img.onload = (e) =>{
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);  //drawing the image on the canvas
    }
}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);    
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

penColorCont.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

penWidthElem.addEventListener("change", (e) => {
    penWidth = penWidthElem.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) =>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) =>  {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    //data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("undoRedo", (data) => {
    undoRedoCanvas(data);
})
