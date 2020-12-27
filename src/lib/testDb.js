const Mustache = require('mustache');
const ClientsService = require('../services/clients');
const MongoLib = require('./mongo');

const getMessage = require('../utils/getMessages');


const clientService = new ClientsService();
const mongo = new MongoLib();

// clientService.getClient({ clientUid: '5ea3c074a321458549f68c3c' }).then((client) => {
//   console.log(client);
// });

// // { $exists: true, $not: { $gt: 0 } }
// // { sent: true }
// mongo.getAll('clients', { sent: true }).then((clients) => {
//   clients.forEach((client) => {
//     const clientUid = client._id;
//     const sent = new Date() - 1;
//     console.log(client);
//     // mongo.update('clients', clientUid, { sent })
//     //   .then((c) => {
//     //     console.log('client updated', c);
//     //   });
//   });
// });

// (async () => {
//   const clients = await mongo.getAll('clients', { sent: false });
//   console.log('Mundo de clientes', clients);
// })();


// // { $not: { $gt: 0 } }
// mongo.getAll('clients', { sent: { $gt: 0 } }).then((clients) => {
//   clients.forEach((client) => {
//     const clientUid = client._id;
//     // console.log(client.phone);
//     const whatsapp = `521${client.phone}@c.us`;
//     // mongo.update('clients', clientUid, { whatsapp })
//     //   .then((c) => {
//     //     console.log('Whatsapp = ', client.phone, c);
//     //   });
//   });
// });


// const output = Mustache.render('Hola {{prefix}} {{name}} {{lastName}}, cómo se encuentra', { name: 'David', lastName: 'Behar', prefix: 'Sr' });

const output = getMessage('David', true, 'Sr');

console.log(output);


mongo.update(
  'clients',
  '5ea3c074a321458549f68c3c',
  {
    ack: 0,
  },
  { messages: 'return-to-business' },
).then((c) => {
  console.log(c);
});
