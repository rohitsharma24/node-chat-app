const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

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
    socket.emit('newMessage', {
        from: 'Andrew',
        text: 'Hey.. Ready for sanju',
        createdAt: new Date()
    });
    socket.on('createMessage', (message) => {
        console.log(JSON.stringify(message, undefined, 2));
    });
})

server.listen(PORT, (err => {
    if(err) {
        console.log(`Service has not started on ${PORT}`);
    } else {
        console.log(`Service has been started on ${PORT}`);
    } 
}));