import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { desc, limit } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['lb'],
  async execute(msg: Message) {
    const topBalance = await db.query.users.findMany({
      orderBy: desc(users.balance),
      limit: 10,
    });

    const topWagered = await db.query.users.findMany({
      orderBy: desc(users.totalWagered),
      limit: 10,
    });

    const embed = baseEmbed()
      .setTitle('🏆 Leaderboards')
      .addFields(
        {
          name: '💰 Top Balance',
          value: topBalance.map((u, i) => `${i + 1}. ${u.username} - $${u.balance}`).join('\n') || 'N/A',
          inline: true,
        },
        {
          name: '📈 Top Wagered',
          value: topWagered.map((u, i) => `${i + 1}. ${u.username} - $${u.totalWagered}`).join('\n') || 'N/A',
          inline: true,
        },
      );

    msg.reply({ embeds: [embed] });
  },
};
