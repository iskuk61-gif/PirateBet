import { Client } from 'discord.js';
import { db, users } from '@workspace/db';
import { desc, limit } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export function startLeaderboardMonitor(client: Client) {
  setInterval(async () => {
    try {
      const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID!);
      if (!guild) return;

      const channel = guild.channels.cache.find(c => c.name === 'leaderboard');
      if (!channel || !channel.isTextBased()) return;

      const topBalance = await db.query.users.findMany({
        orderBy: desc(users.balance),
        limit: 10,
      });

      const topWagered = await db.query.users.findMany({
        orderBy: desc(users.totalWagered),
        limit: 10,
      });

      const embed = baseEmbed()
        .setTitle('🏆 Live Leaderboard')
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
        )
        .setFooter({ text: `Updated at ${new Date().toLocaleTimeString()}` });

      const messages = await channel.messages.fetch({ limit: 1 });
      const lastMessage = messages.first();

      if (lastMessage && lastMessage.author.id === client.user?.id) {
        await lastMessage.edit({ embeds: [embed] }).catch(() => {});
      } else {
        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    } catch (error) {
      console.error('Leaderboard monitor error:', error);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}
