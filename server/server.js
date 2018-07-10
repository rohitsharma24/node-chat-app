const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isValidString} = require('./utils/validation');
const {Users} = require('./entities/users');

const app = express();
const PORT = process.env.PORT || 3000;
const user = new Users();
app.use(express.static(path.join(__dirname, '../public')));

/* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/indexw.html'));
}); */

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User Connected', socket.id);
    socket.on('joinRoom', (params, callback) => {
    if(!isValidString(params['name']) || !isValidString(params['room'])) {
            return callback('Invalid Details !!!');
        }
        socket.join(params.room);
        user.removeUser(socket.id);
        user.addUser({
            id: socket.id,
            name: params.name,
            room: params.room
        });
        io.to(params.room).emit('updateUserList', user.getUserListByRoom(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });
    
    socket.on('createMessage', (message, cb) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
        if( typeof cb === 'function' ) {
            cb('at the server');
        }
    });
    socket.on('createLocationMessage', function(location) {
        io.emit('newLocationMessage', generateLocationMessage('Admin', location.latitude, location.longitude));
    });
    socket.on('disconnect', () => {
        console.log('User Disconected', socket.id);
        const removedUser = user.removeUser(socket.id);
        if(removedUser) {
            socket.broadcast.to(removedUser.room).emit('updateUserList', user.getUserListByRoom(removedUser.room));
            socket.broadcast.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} has left.`));
        }
    });
});

server.listen(PORT, (err => {
    if(err) {
        console.log(`Service has not started on ${PORT}`);
    } else {
        console.log(`Service has been started on ${PORT}`);
    } 
}));