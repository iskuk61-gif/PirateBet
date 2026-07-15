import { Message } from 'discord.js';

export default {
  aliases: ['d', 'logdep'],
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }
    msg.reply('✅ Deposit logged.');
  },
};
