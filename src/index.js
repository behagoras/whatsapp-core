/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const fs = require('fs');
const {
  Client,
  Location,
  Chat,
} = require('whatsapp-web.js');

const socket = require('socket.io-client')('http://localhost:3001');


// const pingPong = require('./utils/pingPong');
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
  const { to, minutes } = message;
  console.log('message received', message);
  if (to && minutes) {
    sendMessagesInBatch({ to, minutes }, client);
  }
});


client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('QR RECEIVED', qr);
});

client.getChats().then((chats) => {
  console.log('super chats', chats);
});

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
  // sendMessagesInBatch({
  //   to: 0,
  //   minutes: 10,
  // }, client);
  console.log('READY');
  console.log('PROCESO TERMINADO CON ÉXITO');
});

client.on('message', async (message) => {
  const {
    body, from, to, fromMe,
  } = message;
  console.log('MESSAGE RECEIVED', {
    from, to, fromMe, body,
  });
});

client.on('message_create', (msg) => {
  // Fired on all message creations, including your own
  messageSent(msg);
});

client.on('message_revoke_everyone', async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  console.log(after); // message after it was deleted.
  if (before) {
    console.log(before); // message before it was deleted.
  }
});

client.on('message_revoke_me', async (msg) => {
  // Fired whenever a message is only deleted in your own view.
  console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
  /*
        === ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

  if (ack === 3) {
    // The message was read
  }
});

client.on('group_join', (notification) => {
  // User has joined or been added to the group.
  console.log('join', notification);
  // notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
  // User has left or been kicked from the group.
  console.log('leave', notification);
  // notification.reply('User left.');
});

client.on('group_update', (notification) => {
  // Group picture, subject or description has been updated.
  console.log('update', notification);
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
  console.log('Client was logged out', reason);
});
