var socket = io();

function scrollToBottom() {
    const message = jQuery('#message-list');
    const newMessage = message.children('li:last-child');
    const clientHeight = message.prop('clientHeight');
    const scrollTop = message.prop('scrollTop');
    const scrollHeight = message.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if((scrollTop + clientHeight + newMessageHeight + lastMessageHeight) >= scrollHeight) {
        message.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);
    socket.emit('joinRoom', params, function(err) {
        if(err) {
            alert(err);
            window.location.href = '/';
        }
    });
});
socket.on('newMessage', function(message) {
    const formattedCreatedAt = moment(message.createdAt).format('h:mm a');
    const newMessageHtml = jQuery('#message-template').html(); 
    const html = Mustache.render(newMessageHtml, {
        text: message.text,
        from: message.from,
        createdAt: formattedCreatedAt
    });
    jQuery('#message-list').append(html);
    scrollToBottom();
    /* console.log('newMessage', JSON.stringify(message, undefined, 2));
    const li = jQuery('<li></li>');
    li.text(`${message.from} ${moment(message.createdAt).format('h:mm a')}: ${message.text}`);
    jQuery('#message-list').append(li); */
});
socket.on('disconnect', function() {
    //console.log('disconnected from server');
});

socket.on('newLocationMessage', function(message) {
    const formattedCreatedAt = moment(message.createdAt).format('h:mm a');
    const newLocationHtml = jQuery('#location-message-template').html();
    const renderHtml = Mustache.render(newLocationHtml, {
        from: message.from,
        url: message.url,
        createdAt: formattedCreatedAt
    });
    jQuery('#message-list').append(renderHtml);
    scrollToBottom();
});

socket.on('updateUserList', function(users) {
    const ol = jQuery('<ol></ol>');
    users.forEach(user => {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    const messageTextbox = jQuery('[name=message-box]');
    const text = messageTextbox.val();
    socket.emit('createMessage', {text}, function() {
        messageTextbox.val('');
    });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send location');
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Can\'t find your location');
    });
});
