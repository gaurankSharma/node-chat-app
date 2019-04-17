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

socket.on("newLocationMessage", function (message) {
    let li = jQuery("<li> </li>");
    let a = jQuery('<a target="_blank"> my current location</a>');
    li.text(`${message.from}:`);
    a.attr('href', message.url);
    li.append(a)

    jQuery('#messages').append(li);
})

jQuery("#message-form").on('submit', function (e) {
    e.preventDefault();
    let messageText = jQuery('[name=message]');
    socket.emit("cMessage", {
        from: "user",
        text: messageText.val()
    }, function () {
        messageText.val('')
    });
});
let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert("geo location is not availble");
    }
    locationButton.attr("disabled", "disabled").text('sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Sending location');
        socket.emit('cLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Sending location');
        alert("anable to fatch location");
    })
});
