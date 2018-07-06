const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

/* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/indexw.html'));
}); */

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User Connected');
    
    socket.on('disconnect', () => {
        console.log('User Disconected');
    });
    
    socket.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));
    socket.on('createMessage', (message, cb) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
        if( typeof cb === 'function' ) {
            cb('at the server');
        }
        
    });
    socket.on('createLocationMessage', function(location) {
        io.emit('newLocationMessage', generateLocationMessage('Admin', location.latitude, location.longitude));
    });
})

server.listen(PORT, (err => {
    if(err) {
        console.log(`Service has not started on ${PORT}`);
    } else {
        console.log(`Service has been started on ${PORT}`);
    } 
}));