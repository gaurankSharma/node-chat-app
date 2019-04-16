let socket = io();
socket.on('connect', function () {
    console.log("new one is here");
});
socket.on('disconnect', function () {
    console.log("connction lost");
});

socket.on("newMessage", function (message) {
    console.log('new message ', message);
})