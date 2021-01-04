const Mustache = require('mustache');

// const path = require('path');
// const messageUsted = '';
// const messageTu = messageUsted;
// const audioUrl = path.join(__dirname, '../../media/mensaje-1.ogg');

const getMessages = (name, usted, prefix, clientMessage) => {
  let nombre = name;
  if (usted) {
    if (prefix === 'Sr') {
      nombre = `Sr ${name}`;
    } else {
      nombre = `Sra ${name}`;
    }
  }
  const cliente = {
    nombre, usted, prefix,
  };
  const message = Mustache.render(clientMessage, cliente);
  return {
    message,
    audioUrl: null,
    // message: Mustache.render(usted ? messageUsted : messageTu, cliente),
    // audioUrl: audioUrl || null,
  };
};

module.exports = getMessages;
