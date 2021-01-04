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
const updateClientWhenSent = require('./updateClientWhenSent');
const updateClientWithoutWhatsapp = require('./updateClientWithoutWhatsapp');

const mongo = new MongoLib();

const getWhatsappFromCustomer = ({ phone, whatsapp }) => {
  if (whatsapp) return whatsapp;
  if (phone) return `521${phone}@c.us`;
  return undefined;
};

const sendMessagesInBatch = async ({
  to,
  minutes,
  messages,
  campaign = 'envio-gratis-1',
}, client) => {
  const query = {
    messages: {
      $not: { $in: [campaign] },
    },
    whatsapp: { $ne: false },
    phone: { $ne: null },
    // tienda: { $not: /14 ?[dD]/ }, // not argentina 14d
    // fullName2: { $not: /14 ?[dD]/ }, // not argentina 14d
  };
  const customers = await mongo.getAll('clients', query);

  for (let index = 0; index < to; index += 1) {
    const customer = customers[index] || {};
    const {
      name, usted, prefix, fullName,
    } = customer;
    console.log('last before error, i think');

    const whatsapp = getWhatsappFromCustomer(customer);
    const time = minutes ? Math.random() * 60000 * minutes : Math.random() * 10000;

    console.log(index, time / 1000 / 60, fullName);

    if (whatsapp) {
      setTimeout(async () => {
        try {
          console.log(chalk.cyan('whatsapp', whatsapp));
          if (messages) {
            await messages.forEach(async (unformattedMessage, subMessageIndex) => {
              const { message } = getMessages(name, usted, prefix, unformattedMessage);
              // if (audioUrl) await sendAudioMessage(client, whatsapp, audioUrl);
              await setTimeout(async () => {
                await client.sendMessage(whatsapp, message);
              }, 3000 * subMessageIndex);
            });
          }
          await updateClientWhenSent(customer, whatsapp, campaign);
        } catch (error) {
          console.error(cError(error, whatsapp));
          await updateClientWithoutWhatsapp(customer);
        }
      }, time);
    } else {
      console.log(chalk.orange('the client does not have whatsapp', customer));
    }
  }
};

module.exports = sendMessagesInBatch;
