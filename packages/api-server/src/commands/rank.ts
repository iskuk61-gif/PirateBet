import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';
import { getRank } from '../utils/ranks';

export default {
  async execute(msg: Message) {
    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      return msg.reply('❌ Account not found.');
    }

    const rank = getRank(Number(user.totalWagered));
    const nextRankWager = getNextRankWager(Number(user.totalWagered));

    const embed = baseEmbed()
      .setTitle('🎖️ Your VIP Rank')
      .addFields(
        { name: 'Current Rank', value: rank, inline: true },
        { name: 'Total Wagered', value: `$${user.totalWagered}`, inline: true },
        { name: 'Next Rank At', value: `$${nextRankWager}`, inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};

function getNextRankWager(wagered: number): number {
  if (wagered < 100) return 100;
  if (wagered < 500) return 500;
  if (wagered < 2000) return 2000;
  if (wagered < 10000) return 10000;
  return 10000;
}
