const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const {generateMessage, generateLocationMessage, generateTypingMessage} = require('./utils/message');
const {isValidString} = require('./utils/validation');
const {Users} = require('./entities/users');

const app = express();
const PORT = process.env.PORT || 3000;
const user = new Users();
app.use(express.static(path.join(__dirname, '../public')));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
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
        const currentUser = user.getUser(socket.id);
        if(currentUser){
            io.to(currentUser.room).emit('newMessage', generateMessage(currentUser.name, message.text));
            if( typeof cb === 'function' ) {
                cb('success');
            }
        }
    });
    socket.on('createLocationMessage', (location) => {
        const currentUser = user.getUser(socket.id);
        if(currentUser){
            io.to(currentUser.room).emit('newLocationMessage', generateLocationMessage(currentUser.name, location.latitude, location.longitude));
        }
    });
    socket.on('typing', () => {
        const currentUser = user.getUser(socket.id);
        if(currentUser){
            socket.broadcast.to(currentUser.room).emit('typingMessage', generateTypingMessage(currentUser.name));
        }
    });
    socket.on('disconnect', () => {
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