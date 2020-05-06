/* eslint-disable no-loop-func */
const chalk = require('chalk');

const cError = chalk.bold.red;
const cWarning = chalk.keyword('orange');
const cSuccess = chalk.green;

const fs = require('fs');
const getMessage = require('./getMessages');
// const ClientsService = require('./services/clients');
const MongoLib = require('../lib/mongo');

const getFormattedDates = require('./getFormattedDates');

// const clientService = new ClientsService();
const mongo = new MongoLib();

const sendMessagesInBatch = async ({ to, minutes }, client) => {
  // eslint-disable-next-line max-len
  // const customers = await mongo.getAll('clients', { sent: false, whatsapp: { $not: { $eq: false } } });
  const customers = await mongo.getAll('clients', { whatsapp: { $exists: true, $ne: false }, messages: { $exists: false } });
  // console.log('Mundo de clientes', customers);
  for (let index = 0; index < to; index += 1) {
    const customer = customers[index];
    const {
      name,
      usted,
      prefix,
      // send,
      phone,
      fullName,
      // sent,
      // received,
      // replied,
    } = customer;

    const message = getMessage(name, usted, prefix);
    const whatsapp = `521${phone}@c.us`;
    const time = minutes ? Math.random() * 60000 * minutes : Math.random() * 10000;
    const clientUid = customer._id;

    console.log(index, time / 1000 / 60, fullName);

    setTimeout(async () => {
      try {
        console.log(chalk.cyan('whatsapp', whatsapp));
        await client.sendMessage(whatsapp, message);

        mongo.update(
          'clients',
          clientUid,
          {
            $push: { messages: 3 },
            whatsapp,
            sent: new Date(),
            ack: 0,
          },
        )
          .then((c) => {
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
        mongo.update('clients', clientUid, { whatsapp: false, estatus: 'no whatsapp', sent: getFormattedDates(new Date()) })
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
