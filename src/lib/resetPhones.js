const errorPhones = require('../private/error-phones');
const ClientsService = require('../services/clients');

const clientService = new ClientsService();

const resetPhones = (phones) => phones.forEach((phone) => {
  const unset = ['trouble', 'setted', 'estatus', 'whatsapp'];
  const set = { sent: false };
  clientService.updateClientFromPhone({ phone, unset, set })
    .then((data) => {
      console.log('resetPhones.js ~ updateClientFromPhone ~ updatedClientUid', data);
      return data;
    });
});

console.log('errorPhones.length', errorPhones.length);
resetPhones(errorPhones);
