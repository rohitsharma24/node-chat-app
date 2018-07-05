const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const {generateMessage} = require('./utils/message');

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
        console.log('User has been disconected');
    });
    
    socket.emit('newMessage', generateMessage('admin', 'welcome to chat app'));
    socket.broadcast.emit('newMessage', generateMessage('admin', 'New User Joined'));
    socket.on('createMessage', (message) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
    });
})

server.listen(PORT, (err => {
    if(err) {
        console.log(`Service has not started on ${PORT}`);
    } else {
        console.log(`Service has been started on ${PORT}`);
    } 
}));