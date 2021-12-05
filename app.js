const express = require("express");
const socket = require("socket.io");

const app = express(); //Initialization and server ready

app.use(express.static("public"));

let port = process.env.PORT || 8080;
let server = app.listen(port, () => {
    console.log("Listening to port" + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made Socket Connection");

    //Received data
    socket.on("beginPath", (data) => {
        //data -> data from backend
        //Now transfer data to all connected computers
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoRedo", (data) => {
        io.sockets.emit("undoRedo", data);
    })    
})

