/* eslint-disable no-loop-func */
const chalk = require('chalk');

const cError = chalk.bold.red;
const cWarning = chalk.keyword('orange');
const cSuccess = chalk.green;

const fs = require('fs');
const MongoLib = require('../lib/mongo');

const getFormattedDates = require('./getFormattedDates');
const sendAudioMessage = require('./sendAudioMessage');
const getMessages = require('./getMessages');

const mongo = new MongoLib();


const sendMessagesInBatch = async ({
  to,
  minutes,
  clientMessage,
  clientAudioUrl,
  campaign = 'envio-gratis-1',
}, client) => {
  const query = {
    messages: {
      $not: { $in: [campaign] },
    },
    whatsapp: { $ne: false },
    phone: { $ne: null },
    tienda: { $not: /14 ?[dD]/ }, // not argentina 14d
    fullName2: { $not: /14 ?[dD]/ }, // not argentina 14d
  };
  const customers = await mongo.getAll('clients', query);


  for (let index = 0; index < to; index += 1) {
    const customer = customers[index] || {};
    const {
      name,
      usted,
      prefix,
      phone,
      fullName,
    } = customer;

    const getMessagesObject = getMessages(name, usted, prefix);
    let { message, audioUrl } = getMessagesObject;
    if (clientMessage) message = clientMessage;
    if (clientAudioUrl) audioUrl = clientAudioUrl;
    const whatsapp = `521${phone}@c.us`;
    const time = minutes ? Math.random() * 60000 * minutes : Math.random() * 10000;
    const clientUid = customer._id;

    console.log(index, time / 1000 / 60, fullName);

    setTimeout(async () => {
      try {
        console.log(chalk.cyan('whatsapp', whatsapp));
        await client.sendMessage(whatsapp, message);
        if (audioUrl) {
          sendAudioMessage(client, whatsapp, audioUrl);
        }
        mongo.update(
          'clients',
          clientUid,
          {
            whatsapp,
            sent: new Date(),
            ack: 0,
          },
          { messages: campaign },
        )
          .then((c) => {
            console.log('super c', c);
            console.log(cSuccess(`Message sent to ${name} with the id #${c}`), `whatsapp marked as {whatsapp:${whatsapp}}`);
            const logMessage = `${clientUid}:${fullName},${phone}\n`;

            fs.appendFile('./src/reports/received.txt', logMessage, 'utf8',
              (err) => {
                if (err) throw err;
                console.log('data agregada al archivo', cSuccess('./src/reports/received.txt'), ' con éxito.', cWarning(logMessage));
              });
          });
      } catch (error) {
        console.error(cError(error, whatsapp));
        mongo.update('clients',
          clientUid,
          {
            whatsapp: false,
            estatus: 'no whatsapp',
            sent: getFormattedDates(new Date()),
          })
          .then((c) => {
            console.error(cError(`Message not sent to ${fullName} with the id #${c}`), 'whatsapp marked as false {whatsapp:false}');
            const logMessage = `${clientUid}:${fullName},${phone}\n`;
            fs.appendFile('./src/reports/not_received.txt', logMessage, 'utf8',
              (err) => {
                if (err) throw err;
                console.log('data agregada al archivo', cError('./src/reports/not_received.txt'), ' con éxito.', cWarning(logMessage));
              });
          });
      }
    }, time);
  }
};

module.exports = sendMessagesInBatch;
