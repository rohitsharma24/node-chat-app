class Users {
    constructor() {
        this.users = [];
    }
    addUser({id, name, room}) {
        const user = {
            id,
            name,
            room
        };
        this.users.push(user);
    }
    removeUser(id) {
        const indexOfUser = this.users.findIndex(user => user.id === id);
        if(indexOfUser > -1) {
            return this.users.splice(indexOfUser, 1).pop();
        } else {
            return {};
        }
    }
    getUser(id) {
        const user = this.users.find(user => user.id === id);
        return user || {};
    }
    getUserListByRoom(room) {
        const roomUsers = this.users.filter(user => user.room === room);
        return roomUsers.map(user => user.name);
    }
}

module.exports = {Users};