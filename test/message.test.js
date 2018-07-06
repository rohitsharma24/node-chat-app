const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('../server/utils/message');

describe('generateMessage', () => {
    it('should return object, when passed \'from\' and \'text\'', () => {
        const message = generateMessage('admin', 'test message');
        expect(message).toHaveProperty('from');
        expect(message.from).toMatch('admin');
        expect(message).toHaveProperty('text');
        expect(message.text).toMatch('test message');
        expect(message).toHaveProperty('createdAt');
        expect(typeof message.createdAt).toBe('number');
    });
});

describe('generateLocationMessage', () => {
    it('should return location object', () => {
        const latitude = 12.0213;
        const longitute = 65.4545;
        const message = generateLocationMessage('admin', latitude, longitute);
        expect(message).toHaveProperty('from');
        expect(message.from).toMatch('admin');
        expect(message).toHaveProperty('url');
        expect(message.url).toMatch(`https://www.google.com/maps?q=${latitude},${longitute}`);
        expect(message).toHaveProperty('createdAt');
        expect(typeof message.createdAt).toBe('number');
    });
});