const Mustache = require('mustache');
const ClientsService = require('../services/clients');
const MongoLib = require('./mongo');

const getMessage = require('../utils/getMessages');


const clientService = new ClientsService();
const mongo = new MongoLib();

const getCustomers = async () => {
  const customers = await mongo.getAll('clients', { messages: { $not: { $in: ['envio-gratis-1'] } }, whatsapp: { $ne: false }, phone: { $ne: null } });
  // console.log(customers);

  for (let index = 0; index < 5; index += 1) {
    const customer = customers[index] || {};
    const {
      name,
      phone,
    } = customer;
    console.log(`${name}: ${phone}`);
  }
};

getCustomers();
