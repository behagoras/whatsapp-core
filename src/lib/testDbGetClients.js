const MongoLib = require('./mongo');

const mongo = new MongoLib();

const getCustomers = async () => {
  const customers = await mongo.getAll('clients', { messages: { $not: { $in: ['envio-gratis-1'] } }, whatsapp: { $ne: false }, phone: { $ne: null } });
  for (let index = 0; index < 5; index += 1) {
    const customer = customers[index] || {};
    const {
      name,
      phone,
    } = customer;
  }
};

getCustomers();
