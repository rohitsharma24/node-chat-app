const expect = require('expect');
const {Users} = require('../server/entities/users');

describe('Users', () => {
    var testUsers;
    beforeEach(() => {
        const users = [{
            id: '1',
            name: 'user one',
            room: 'A'
        },
        {
            id: '2',
            name: 'user two',
            room: 'A'
        },
        {
            id: '3',
            name: 'user three',
            room: 'B'
        }];
        testUsers = new Users();
        testUsers.users = users;
    });
    it('should create users', () => {
        const user = new Users();
        const testUser = {
            id: '123',
            name: 'testUser',
            room: 'Business'
        };
        user.addUser(testUser);
        expect(user.users).toEqual([testUser]);
    });
    it('should return users in a room', () => {
        const userNames = testUsers.getUserListByRoom('A');
        expect(userNames.length).toBe(2);
    });
    it('should remove user with valid Id', () => {
        const id = '1';
        const deletedUser = testUsers.removeUser(id);
        expect(deletedUser.id).toBe(id);
    });
    it('should not remove any user with invalid Id', () => {
        const id = '10';
        const deletedUser = testUsers.removeUser(id);
        expect(deletedUser).toEqual({});
    });
    it('should get user with valid Id', () => {
        const id = '1';
        const user = testUsers.getUser(id);
        expect(user).toMatchObject({
            id,
            name: 'user one'
        });
    });
    it('should not get user with invalid Id', () => {
        const id = '10';
        const user = testUsers.getUser(id);
        expect(user).toEqual({});
    });
});