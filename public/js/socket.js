var socket = io();
socket.on('connect', function() {
    console.log('connected to server');

    /* socket.emit('createMessage', {text: 'this is a text', from: 'andrew'}, (data) => {
        console.log('got it', data);
    }) */
});
socket.on('newMessage', function(message) {
    console.log('newMessage', JSON.stringify(message, undefined, 2));
    const li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#message-list').append(li);
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newLocationMessage', function(message) {
    const li = jQuery('<li></li>');
    const anchor = jQuery("<a target='_blank'>My Current Location</a>");
    anchor.attr('href', message.url);
    li.append(anchor);
    jQuery('#message-list').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    const text = jQuery('[name=message-box]').val();
    socket.emit('createMessage', {from: 'user', text});
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('Can\'t find your location');
    });
});
