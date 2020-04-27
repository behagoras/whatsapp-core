const messageUsted = `
¿Cómo se encuentra?

Le quería platicar que estoy recibiendo mercancía, por lo que estoy lista para el día de las madres.

Estoy surtiendo pedidos desde mi oficina en casa, por lo que me puede pedir lo que quiera del catálogo y yo se lo envío.

Le recomiendo hacer su pedido rápido para que no se vean muy saturadas las paqueterías y no se agoten los mejores productos.

Un fuerte abrazo.`;
const messageTu = `

¿Cómo te encuentras?

Te quería platicar que estoy recibiendo mercancía, por lo que estoy lista para el día de las madres.

Estoy surtiendo pedidos desde mi oficina en casa, por lo que me puedes pedir lo que quieras del catálogo y yo te lo envío.

Te recomiendo hacer tu pedido rápido para que no se vean muy saturadas las paqueterías y no se agoten los mejores productos.

Un fuerte abrazo.
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
  return [`Hola ${nombre} ${usted ? messageUsted : messageTu}`];
};

module.exports = getMessage;
