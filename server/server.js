const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require('http');
const { generateMessage, generateLocationMessage } = require("./util/message")
const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');
    socket.emit("newMessage", generateMessage("Admin", "Well come to chat app"))
    socket.broadcast.emit("newMessage", generateMessage("Admin", "new user joined"))

    socket.on('cMessage', (message, callback) => {
        console.log(message);
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback();
    });

    socket.on("cLocation", (coords) => {
        io.emit('newLocationMessage', generateLocationMessage("admin", coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log("disconnected user");
    });
});


server.listen(port, () => {
    console.log('server is up on', port);
});    