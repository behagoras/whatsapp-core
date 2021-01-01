const MongoLib = require('./mongo');
const getMessage = require('../utils/getMessages');

const mongo = new MongoLib();
const output = getMessage('David', true, 'Sr');

console.log(output);


mongo.update(
  'clients',
  '5ea3c074a321458549f68c3c',
  {
    ack: 0,
  },
  { messages: 'return-to-business' },
).then((c) => {
  console.log(c);
});
