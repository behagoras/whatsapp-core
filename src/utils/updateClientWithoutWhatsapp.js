const chalk = require('chalk');

const cError = chalk.bold.red;
const cWarning = chalk.keyword('orange');

const fs = require('fs');
const MongoLib = require('../lib/mongo');
const getFormattedDates = require('./getFormattedDates');

const mongo = new MongoLib();
const updateClientWithoutWhatsapp = async (customer) => {
  const { phone, fullName } = customer;
  const clientUid = customer._id;
  try {
    const c = await mongo.update(
      'clients',
      clientUid, {
        whatsapp: false,
        estatus: 'no whatsapp',
        sent: getFormattedDates(new Date()),
      },
    );
    const logMessage = `${clientUid}:${fullName},${phone}\n`;
    fs.appendFile(
      './src/reports/not_received.txt',
      logMessage,
      'utf8',
      (err) => {
        if (err) throw err;
        console.log('data agregada al archivo', cError('./src/reports/not_received.txt'), ' con éxito.', cWarning(logMessage));
      },
    );
    console.error(cError(`Message not sent to ${fullName} with the id #${c}`), 'whatsapp marked as false {whatsapp:false}');
    return c;
  } catch (error) {
    console.log(cError(error));
  }
  return 0;
};
module.exports = updateClientWithoutWhatsapp;
