
let socket = io();

(function ($) {
    $.deparam = $.deparam || function (uri) {
        if (uri === undefined) {
            uri = window.location.search;
        }
        var queryString = {};
        uri.replace(
            new RegExp(
                "([^?=&]+)(=([^&#]*))?", "g"),
            function ($0, $1, $2, $3) {
                queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
            }
        );
        return queryString;
    };
})(jQuery);


function scrollToBottom() {
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let oldMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + oldMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    let params = jQuery.deparam(location.search);
    socket.emit("join", params, function (error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else {
            console.log('no error');
        }
    })
});
socket.on('disconnect', function () {
    console.log("connction lost");
});

socket.on("updateUserList", function (users) {
    let ol = jQuery("<ol></ol>");
    users.forEach(user => {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

//onload 
$(window).on("load", function () {
    let template = jQuery('#message-template').html();

    for (let i = 0; i < localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))).text == "Well come to chat app") {
        } else {
            let html = Mustache.render(template, JSON.parse(localStorage.getItem(localStorage.key(i))));
            jQuery('#messages').append(html);
            scrollToBottom();
        }
    }
})


socket.on("newMessage", function (message) {
    let timeStamp = moment(message.createdAt).format('h:mm:ss a');
    let template = jQuery('#message-template').html();
    const msgObj = {
        text: message.text,
        from: message.from,
        createdAt: timeStamp
    };
    let html = Mustache.render(template, msgObj);
    //local saving messages -----
    console.log(msgObj);
    localStorage.setItem(timeStamp, JSON.stringify(msgObj));
    jQuery('#messages').append(html);
    scrollToBottom();
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
    scrollToBottom();
})

jQuery("#message-form").on('submit', function (e) {
    e.preventDefault();
    let messageText = jQuery('[name=message]');
    socket.emit("cMessage", {
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

