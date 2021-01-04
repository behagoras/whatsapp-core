const MongoLib = require('./mongo');

const mongo = new MongoLib();

const duplicatePhone1IntoPhone = async () => {
  const query = {
    messages: { $not: { $in: ['envio-gratis-1'] } },
    whatsapp: { $ne: false },
    phone: null,
    phone1: { $ne: null },
  };
  const customers = await mongo.getAll('clients', query);
  let count = 0;
  customers.forEach(async (customer) => {
    if (customer.phone1) {
      console.log(customer.phone1);
      count += 1;
      try {
        const c = await mongo.update(
          'clients',
          customer._id,
          {
            ack: 0,
            phone: customer.phone1,
          },
        );
        console.log('the customer edited', c);
      } catch (error) {
        console.log(error);
      }
    }
  });
  console.log('count', count);
};

duplicatePhone1IntoPhone();
