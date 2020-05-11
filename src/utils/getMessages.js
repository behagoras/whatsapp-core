const Mustache = require('mustache');

const messageUsted = `
En este día tan especial {{nombre}}, le quiero desear todo lo mejor, que siempre tengamos muchos motivos para celebrar y festejemos el regalo de la vida

Feliz día de las madres

😍🙏🤗💐🌷
`;
const messageTu = `
En este día tan especial {{nombre}}, te quiero desear todo lo mejor, que siempre tengamos muchos motivos para celebrar y festejemos el regalo de la vida

Feliz día de las madres

😍🙏🤗💐🌷
`;

const getMessage = (name, usted, prefix) => {
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
  return Mustache.render(usted ? messageUsted : messageTu, cliente);
  // return `¡Hola ${nombre}! ${usted ? messageUsted : messageTu}`;
};

module.exports = getMessage;
