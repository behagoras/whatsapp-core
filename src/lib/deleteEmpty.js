const MongoLib = require('./mongo');

const mongo = new MongoLib();
const deleteEmpty = async () => {
  const query = {
    fullName: '',
    name: '',
    push: '',
  };
  const customers = await mongo.getAll('clients', query);
  customers.forEach(async (customer) => {
    await mongo.deleteOne('clients', customer._id);
  });
};

deleteEmpty();
