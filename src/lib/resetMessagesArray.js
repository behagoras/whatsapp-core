const MongoLib = require('./mongo');

const mongo = new MongoLib();

const duplicatePhone1IntoPhone = async () => {
  const query = {
    messages: { $not: { $type: 'array' } },
    whatsapp: { $ne: false },
    phone: { $ne: null },
  };
  const customers = await mongo.getAll('clients', query);
  let count = 0;
  customers.forEach(async (customer) => {
    console.log(customer.phone1);
    count += 1;
    try {
      const c = await mongo.update(
        'clients',
        customer._id,
        { messages: [] },
      );
      console.log('the customer edited', customer._id);
    } catch (error) {
      console.log(error);
    }
  });
  console.log('count', count);
};

duplicatePhone1IntoPhone();
