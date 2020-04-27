const pingPong = async (client, msg, Location) => {
  const {
    body, from, to, fromMe, type,
  } = msg;

  switch (body) {
    case '!ping reply':
      msg.reply('pong');
      break;
    case '!ping':
      client.sendMessage(from, 'pong');
      break;
    default:
      break;
  }

  if (type === 'chat') {
    console.log('this is a chat message');
    const chat = await msg.getChat();
    console.log('chat', chat);
  }

  if (body.startsWith('!sendto ')) {
    let number = body.split(' ')[1];
    const messageIndex = body.indexOf(number) + number.length;
    const message = body.slice(messageIndex, body.length);
    number = number.includes('@c.us') ? number : `${number}@c.us`;
    const chat = await msg.getChat();
    chat.sendSeen();
    client.sendMessage(number, message);
  }
  if (body.startsWith('!subject ')) {
    // Change the group subject
    const chat = await msg.getChat();
    if (chat.isGroup) {
      const newSubject = body.slice(9);
      chat.setSubject(newSubject);
    } else {
      msg.reply('This command can only be used in a group!');
    }
  } else if (body.startsWith('!echo ')) {
    // Replies with the same message
    msg.reply(body.slice(6));
  } else if (body.startsWith('!desc ')) {
    // Change the group description
    const chat = await msg.getChat();
    if (chat.isGroup) {
      const newDescription = body.slice(6);
      chat.setDescription(newDescription);
    } else {
      msg.reply('This command can only be used in a group!');
    }
  } else if (body === '!leave') {
    // Leave the group
    const chat = await msg.getChat();
    if (chat.isGroup) {
      chat.leave();
    } else {
      msg.reply('This command can only be used in a group!');
    }
  } else if (body.startsWith('!join ')) {
    const inviteCode = body.split(' ')[1];
    try {
      await client.acceptInvite(inviteCode);
      // msg.reply('Joined the group!');
    } catch (e) {
      // msg.reply('That invite code seems to be invalid.');
    }
  } else if (body === '!groupinfo') {
    const chat = await msg.getChat();
    if (chat.isGroup) {
      // msg.reply(`
      //           *Group Details*
      //           Name: ${chat.name}
      //           Description: ${chat.description}
      //           Created At: ${chat.createdAt.toString()}
      //           Created By: ${chat.owner.user}
      //           Participant count: ${chat.participants.length}
      //       `);
    } else {
      // msg.reply('This command can only be used in a group!');
    }
  } else if (body === '!chats') {
    const chats = await client.getChats();
    client.sendMessage(from, `The bot has ${chats.length} chats open.`);
  } else if (body === '!info') {
    const {
      info,
    } = client;
    client.sendMessage(from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.me.user}
            Platform: ${info.platform}
            WhatsApp version: ${info.phone.wa_version}
        `);
  } else if (body === '!mediainfo' && msg.hasMedia) {
    const attachmentData = await msg.downloadMedia();
    msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
  } else if (body === '!quoteinfo' && msg.hasQuotedMsg) {
    // const quotedMsg = await msg.getQuotedMessage();

    // quotedMsg.reply(`
    //         ID: ${quotedMsg.id._serialized}
    //         Type: ${quotedMsg.type}
    //         Author: ${quotedMsg.author || quotedfrom}
    //         Timestamp: ${quotedMsg.timestamp}
    //         Has Media? ${quotedMsg.hasMedia}
    //     `);
  } else if (body === '!resendmedia' && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      const attachmentData = await quotedMsg.downloadMedia();
      client.sendMessage(from, attachmentData, {
        caption: 'Here\'s your requested media.',
      });
    }
  } else if (body === '!location') {
    msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
  } else if (msg.location) {
    msg.reply(msg.location);
  } else if (body.startsWith('!status ')) {
    const newStatus = body.split(' ')[1];
    await client.setStatus(newStatus);
    msg.reply(`Status was updated to *${newStatus}*`);
  } else if (body === '!mention') {
    const contact = await msg.getContact();
    const chat = await msg.getChat();
    chat.sendMessage(`Hi @${contact.number}!`, {
      mentions: [contact],
    });
  } else if (body === '!delete' && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedfromMe) {
      quotedMsg.delete(true);
    } else {
      msg.reply('I can only delete my own messages');
    }
  } else if (body === '!archive') {
    const chat = await msg.getChat();
    chat.archive();
  } else if (body === '!typing') {
    const chat = await msg.getChat();
    // simulates typing in the chat
    chat.sendStateTyping();
  } else if (body === '!recording') {
    const chat = await msg.getChat();
    // simulates recording audio in the chat
    chat.sendStateRecording();
  } else if (body === '!clearstate') {
    const chat = await msg.getChat();
    // stops typing or recording in the chat
    chat.clearState();
  }
};

module.exports = pingPong;
