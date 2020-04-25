const ClientsService = require('../services/clients');
const MongoLib = require('./mongo');

const clientService = new ClientsService();
const mongo = new MongoLib();

clientService.getClient({ clientUid: '5ea3c074a321458549f68c3c' }).then((client) => {
  console.log(client);
});

// { $exists: true, $not: { $gt: 0 } }
mongo.getAll('clients', { sent: true }).then((clients) => {
  clients.forEach((client) => {
    // eslint-disable-next-line no-underscore-dangle
    const clientUid = client._id;
    const sent = new Date() - 1;
    console.log(client);
    // mongo.update('clients', clientUid, { sent })
    //   .then((c) => {
    //     console.log('client updated', c);
    //   });
  });
});
