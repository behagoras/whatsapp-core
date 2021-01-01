const chalk = require('chalk');
const fs = require('fs');
const MongoLib = require('../lib/mongo');

const mongo = new MongoLib();

const cError = chalk.bold.red;
const cWarning = chalk.yellow;
const cSuccess = chalk.green;

const ackValues = [];
ackValues[-1] = 'ACK_ERROR';
ackValues[0] = 'ACK_PENDING';
ackValues[1] = 'ACK_SERVER';
ackValues[2] = 'ACK_DEVICE';
ackValues[3] = 'ACK_READ';
ackValues[4] = 'ACK_PLAYED';
ackValues[5] = 'ACK_REPLIED';


const messageAck = async (message, ack) => {
  /*
    === ACK VALUES ==
    ACK_ERROR: -1
    ACK_PENDING: 0
    ACK_SERVER: 1
    ACK_DEVICE: 2
    ACK_READ: 3
    ACK_PLAYED: 4
    ACK_REPLIED: 5
  */
  const { to: whatsapp } = message;
  console.log('messageAck', ack, ackValues[ack]);
  try {
    const customers = await mongo.getAll('clients', { whatsapp });
    const customer = customers[0];
    const {
      name,
      phone,
      fullName,
    } = customer;
    const clientUid = customer._id;
    mongo.update('clients', clientUid, { ack })
      .then((c) => {
        console.log(cSuccess(`Message received by ${name} with the id #${c}`), `ack marked as {whatsapp:${whatsapp}}`);
        const logMessage = `${clientUid}:${fullName},${phone}\n`;
        fs.appendFile('./src/reports/ack.txt', logMessage, 'utf8',
          (err) => {
            if (err) throw err;
            console.log('data agregada al archivo', cSuccess('./src/reports/received.txt'), ' con éxito.', cWarning(logMessage));
          });
      })
      .catch((error) => {
        console.error(cError(error));
      });
  } catch (error) {
    console.error(cError(error));
  }
};

module.exports = messageAck;
