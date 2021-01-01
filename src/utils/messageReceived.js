/* eslint-disable no-loop-func */
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


const messageReceived = async (message) => {
  const {
    body, from, to, fromMe,
  } = message;
  console.log(chalk.cyan(
    'MESSAGE RECEIVED',
    `from: ${from}, to: ${to}`,
    `From me? ${fromMe}`,
    'Message: ',
    body,
  ));
  if (!fromMe) {
    try {
      const customers = await mongo.getAll('clients', { whatsapp: from });
      const customer = customers[0];
      const {
        name,
        phone,
        fullName,
        _id: clientUid,
        repliedQuantity,
      } = customer;
      if (fullName) {
        console.log(chalk.cyan(`Mensaje contestado por el cliente ${fullName} con whatsapp: ${to}`));
        mongo.update('clients', clientUid, { repliedQuantity: repliedQuantity ? repliedQuantity + 1 : 1, ack: 5 })
          .then((c) => {
            console.log(cSuccess(`Message received by ${name} with the id #${c}`), `ack marked as {whatsapp:${to}}`);
            const logMessage = `${clientUid}:${fullName},${phone}\n`;
            fs.appendFile('./src/reports/message-received.txt', logMessage, 'utf8',
              (err) => {
                if (err) throw err;
                console.log('data agregada al archivo', cSuccess('./src/reports/received.txt'), ' con éxito.', cWarning(logMessage));
              });
          })
          .catch((error) => {
            console.error(cError(error));
          });
      }
    } catch (error) {
      console.error(cError(error));
    }
  }
};

module.exports = messageReceived;
