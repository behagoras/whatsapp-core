const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const socket = require('socket.io-client')('http://localhost:3001');

const messageAck = require('./utils/messageAck');
const messageReceived = require('./utils/messageReceived');
const sendMessagesInBatch = require('./utils/sendMessagesInBatch');
const messageSent = require('./utils/messageSent');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  // eslint-disable-next-line
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: {
    headless: false,
  },
  session: sessionCfg,
});
// You can use an existing session and avoid scanning a QR
// code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

client.initialize().then(() => {});

socket.emit('chat', { message: 'hola' });
socket.on('sendBulkMessages', (message) => {
  const {
    to,
    minutes,
    message: clientMessage,
    campaign,
  } = message;
  if (to && minutes) {
    sendMessagesInBatch({
      to,
      minutes,
      clientMessage,
      campaign,
    },
    client);
  }
});

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('QR RECEIVED', qr);
});

// client.getChats().then((chats) => {
//   console.log('super chats', chats);
// });

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', (msg) => {
  // Fired if session restore was unsuccessfull
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('Ready app');
});

client.on('message', async (message) => {
  console.log('client.on(message)');
  messageReceived(message);
});

client.on('message_create', (msg) => {
  // Fired on all message creations, including your own
  messageSent(msg);
});

client.on('message_revoke_everyone', async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  console.log('message after it was deleted:', after);
  if (before) {
    console.log('message before it was deleted:', before);
  }
});

client.on('message_revoke_me', async (msg) => {
  // Fired whenever a message is only deleted in your own view.
  console.log('message before it was deleted:', msg.body);
});

client.on('message_ack', async (message, ack) => {
  messageAck(message, ack);
});

client.on('group_join', (notification) => {
  // User has joined or been added to the group.
  console.log('joined to group, notification = ', notification);
  // notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
  console.log('User has left or been kicked from the group, notification = ', notification);
  // notification.reply('User left.');
});

client.on('group_update', (notification) => {
  // Group picture, subject or description has been updated.
  console.log('Group picture, subject or description has been updated, notification = ', notification);
});

client.on('change_battery', (batteryInfo) => {
  // Battery percentage for attached device has changed
  const {
    battery,
    plugged,
  } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out because', reason);
});
