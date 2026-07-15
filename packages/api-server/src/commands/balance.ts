import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';
import { generateBalanceCard } from '../utils/canvas';
import { getRank } from '../utils/ranks';

export default {
  aliases: ['b', 'bal'],
  async execute(msg: Message, args: string[]) {
    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      return msg.reply('❌ Account not found. Use `.deposit` to start!');
    }

    const rank = getRank(Number(user.totalWagered));
    const card = await generateBalanceCard(user.username, String(user.balance), rank);

    msg.reply({
      files: [{ attachment: card, name: 'balance.png' }],
    });
  },
};
