import { Message } from 'discord.js';

export default {
  aliases: ['w', 'logwith'],
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }
    msg.reply('✅ Withdrawal logged.');
  },
};
