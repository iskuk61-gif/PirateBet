import { Message } from 'discord.js';
import { db, bets } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';
import { desc, limit } from 'drizzle-orm';

export default {
  async execute(msg: Message) {
    const userBets = await db.query.bets.findMany({
      where: eq(bets.discordId, msg.author.id),
      orderBy: desc(bets.createdAt),
      limit: 10,
    });

    const embed = baseEmbed()
      .setTitle('📊 Your Last 10 Bets')
      .setDescription(
        userBets.length === 0
          ? 'No bets yet.'
          : userBets.map(b => `${b.game.toUpperCase()} - $${b.betAmount} → ${b.outcome === 'win' ? '✅ +' : '❌ -'}$${b.winAmount}`).join('\n')
      );

    msg.reply({ embeds: [embed] });
  },
};
