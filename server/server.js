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
    socket.emit("newMessage", {
        frim: "Admin",
        text: "well come to chat app",
        createdAt: new Date().getTime()
    })
    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "new user joined app",
        createdAt: new Date().getTime()
    })

    socket.on('newMessage', (message) => {
        console.log(message);
        // io.emit("newMessage", {
        //     to: message.to,
        //     text: message.text,
        //     createdAt: new Date().getTime()})
        socket.broadcast.emit("newMessage", {
            to: message.to,
            text: message.text,
            createdAt: new Date().getTime()
        })
    });
    socket.on('disconnect', () => {
        console.log("disconnected user");
    });
});


server.listen(port, () => {
    console.log('server is up on', port);
});    