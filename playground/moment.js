const moment = require('moment');

//console.log(moment("2018-07-04T18:11:56.100").fromNow());
console.log(moment().add(12, 'h').format('LT'));