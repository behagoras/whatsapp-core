const messageUsted = `

Perdón por mi mensaje anterior.

Hablé con las paqueterías y me dicen que si enviamos paquetes hasta el jueves, alcanzaría a llegar para el día de las madres, quieres que te envíe algo?
`;
const messageTu = `

Hablé con las paqueterías y me dicen que si enviamos paquetes hasta el jueves, alcanzaría a llegar para el día de las madres, quieres que te envíe algo?
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
  return `¡Hola ${nombre}! ${usted ? messageUsted : messageTu}`;
};

module.exports = getMessage;
