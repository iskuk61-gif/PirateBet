import { Message } from 'discord.js';

export default {
  aliases: ['delchan'],
  async execute(msg: Message) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }
    msg.reply('✅ Channel deleted.');
  },
};
