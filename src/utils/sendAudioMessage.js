const { MessageMedia } = require('whatsapp-web.js');

const sendAudioMessage = async (client, whatsapp, imagePath) => {
  const media = MessageMedia.fromFilePath(imagePath);
  const idMessage = await client.sendMessage(whatsapp, media, {
    caption: 'Hola',
  });
  console.log('Mensaje enviado ', idMessage);
  return idMessage;
};

module.exports = sendAudioMessage;
