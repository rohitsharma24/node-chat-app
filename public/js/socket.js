var socket = io();
socket.on('connect', function() {
    console.log('connected to server');
    socket.emit('createMessage', {
        to: 'gordan@gotham.com',
        text: 'Batman is coming'
    });
});
socket.on('newMessage', function(message) {
    console.log(JSON.stringify(message, undefined, 2))
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});