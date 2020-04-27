const VCard = require('vcard');

const card = new VCard();

const messageSent = async (message) => {
  const {
    body,
  } = message;

  if (message.fromMe) {
    const chat = await message.getChat();
    if (chat.name === 'Clientes nuevos') {
      if (body.startsWith('BEGIN:VCARD')) {
        card.readData(body, (err, vcard) => {
          // TODO
          const { FN: name, TEL: telObj } = vcard;
          const { value: phone } = telObj;
          console.log(`We need to add the client ${name} with phone ${phone} to database`);
        });
      }
    }
  }
};

module.exports = messageSent;
