const chalk = require('chalk');

const cError = chalk.bold.red;
const cWarning = chalk.keyword('orange');
const cSuccess = chalk.green;

const fs = require('fs');
const MongoLib = require('../lib/mongo');

const mongo = new MongoLib();

const updateClientWhenSent = async (customer, whatsapp, campaign) => {
  const { phone, fullName, name } = customer;
  const clientUid = customer._id;
  try {
    const clientId = await mongo.update(
      'clients',
      clientUid,
      { whatsapp, sent: new Date(), ack: 0 },
      { messages: campaign },
    );
    const logMessage = `${clientUid}:${fullName},${phone}\n`;
    fs.appendFile('./src/reports/received.txt', logMessage, 'utf8',
      (err) => {
        if (err) throw err;
        console.log('data agregada al archivo', cSuccess('./src/reports/received.txt'), ' con éxito.', cWarning(logMessage));
      });
    console.log(
      cSuccess(`Message sent to ${name} with the id #${clientId}`),
      `and whatsapp marked as {whatsapp:${whatsapp}}`,
    );
    return clientId;
  } catch (error) {
    console.log(cError(error));
  }
  return null;
};

module.exports = updateClientWhenSent;
