const chalk = require('chalk');
const { MessageMedia } = require('whatsapp-web.js');

const cSuccess = chalk.green;

const sendAudioMessage = async (client, whatsapp, imagePath) => {
  const media = MessageMedia.fromFilePath(imagePath);
  const idMessage = await client.sendMessage(whatsapp, media, {
    caption: 'Hola',
  });
  console.log(cSuccess('Mensaje enviado ', idMessage));
  return idMessage;
};

module.exports = sendAudioMessage;
