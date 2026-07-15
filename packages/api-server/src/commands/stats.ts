import { Message } from 'discord.js';
import { db, users, bets } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';
import { generateStatsCard } from '../utils/canvas';

export default {
  async execute(msg: Message) {
    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      return msg.reply('❌ Account not found.');
    }

    const wins = await db.query.bets.findMany({
      where: and(eq(bets.discordId, msg.author.id), eq(bets.outcome, 'win')),
    });

    const losses = await db.query.bets.findMany({
      where: and(eq(bets.discordId, msg.author.id), eq(bets.outcome, 'lose')),
    });

    const cashback = (Number(user.totalWagered) * 0.05).toFixed(2);
    const card = await generateStatsCard(user.username, wins.length, losses.length, String(user.totalWagered), cashback);

    msg.reply({
      files: [{ attachment: card, name: 'stats.png' }],
    });
  },
};
