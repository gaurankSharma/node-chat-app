let socket = io();
socket.on('connect', function () {
    console.log("new one is here");
});
socket.on('disconnect', function () {
    console.log("connction lost");
});

socket.on("newMessage", function (message) {
    console.log('new message ', message);
    let li = jQuery("<li> </li>");
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
})

jQuery("#message-form").on('submit', function (e) {
    e.preventDefault();
    socket.emit("cMessage", {
        from: "user",
        text: jQuery('[name=message]').val()
    }, function () {

    })
})