var socket = io();
socket.on('connect', function() {
    console.log('connected to server');
});
socket.on('newMessage', function(message) {
    console.log('newMessage',JSON.stringify(message, undefined, 2));
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});