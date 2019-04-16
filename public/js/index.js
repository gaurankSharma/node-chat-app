let socket = io();
socket.on('connect', function () {
    console.log("new one is here");
    socket.emit('message', {
        to: "gaurnak",
        text: 'work for me'
    });
});
socket.on('disconnect', function () {
    console.log("connction lost");
});

socket.on("newMessage", function (message) {
    console.log('new message ', message);
})