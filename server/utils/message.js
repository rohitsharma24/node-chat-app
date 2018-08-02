const moment = require('moment');
const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt : moment().valueOf()
    };
}
const generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    };
};

const generateTypingMessage = (from) => {
    return {
        from,
        text: 'typing...'
    };
};
module.exports = {generateMessage, generateLocationMessage, generateTypingMessage};