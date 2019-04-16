const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require('http');

const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');
    socket.emit('newEmail', {
        from: "garuank",
        text: "hey yha!!",
        time: "16-april"
    });
    socket.on('message', (message) => {
        console.log(message);
    });
    socket.emit('newMessage', {
        to: "server",
        text: "see you"
    })
    socket.on('disconnect', () => {
        console.log("disconnected user");
    });
});


server.listen(port, () => {
    console.log('server is up on', port);
});    