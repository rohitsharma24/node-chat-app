const expect = require('expect');
const {generateMessage} = require('../server/utils/message');

describe('generateMessage', () => {
    it('should return object, when passed \'from\' and \'text\'', () => {
        const res = generateMessage('admin', 'test message');
        expect(res).toHaveProperty('from');
        expect(res.from).toMatch('admin');
        expect(res).toHaveProperty('text');
        expect(res.text).toMatch('test message');
        expect(res).toHaveProperty('createdAt');
        expect(typeof res.createdAt).toBe('number');
    });
});