const Mustache = require('mustache');
const path = require('path');

const messageUsted = `¡Hola {{nombre}}, Feliz Navidad y próspero año nuevo!

Para este fin de año me llegaron cosas bien bonitas.

Es momento de apoyarnos sacando una oportunidad de este momento de crisis, de estar mejor y de salir adelante.

Por esto decidí que desde hoy *hasta el 31 de enero*, en la compra de $2,000 pesos o más:

*¡EL ENVÍO VA POR MI CUENTA!*.

Espero te animes, te mando un fuerte abrazo y felices fiestas 🥳 🎈🎉.

Dime porfa si quieres que te mande el catálogo.
`;
const messageTu = messageUsted;

const audioUrl = path.join(__dirname, '../../media/mensaje-1.ogg');

const getMessages = (name, usted, prefix) => {
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

  console.log('getMessages function');

  return {
    message: Mustache.render(usted ? messageUsted : messageTu, cliente),
    // audioUrl: audioUrl || null,
  };
  // return `¡Hola ${nombre}! ${usted ? messageUsted : messageTu}`;
};

module.exports = getMessages;
