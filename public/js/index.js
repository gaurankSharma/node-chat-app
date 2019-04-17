
let socket = io();
socket.on('connect', function () {
    console.log("new one is here");
});
socket.on('disconnect', function () {
    console.log("connction lost");
});

socket.on("newMessage", function (message) {
    let timeStamp = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: timeStamp
    });
    jQuery('#messages').append(html);
})

socket.on("newLocationMessage", function (message) {
    let timeStamp = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: timeStamp
    });

    jQuery('#messages').append(html);
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
