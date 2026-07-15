import { Message } from 'discord.js';
import { db, users } from '@workspace/db';

export default {
  async execute(msg: Message) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    await db.update(users).set({ balance: '0' });
    msg.reply('✅ All balances reset to $0.');
  },
};
