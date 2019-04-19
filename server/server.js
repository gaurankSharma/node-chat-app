const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require('http');
const { generateMessage, generateLocationMessage } = require("./util/message");
const { isRealString } = require('./util/validation');
const { Users } = require('./util/users');
const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room name is must be string')
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit("newMessage", generateMessage("Admin", "Well come to chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} is joined`));
        callback();
    })
    socket.on('cMessage', (message, callback) => {
        console.log(message);
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback();
    });

    socket.on("cLocation", (coords) => {
        io.emit('newLocationMessage', generateLocationMessage("admin", coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left. `));
        }
    });
});


server.listen(port, () => {
    console.log('server is up on', port);
});    