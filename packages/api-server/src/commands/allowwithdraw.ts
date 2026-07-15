import { Message } from 'discord.js';

export default {
  aliases: ['aw'],
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }
    msg.reply('✅ Withdrawal access granted.');
  },
};
