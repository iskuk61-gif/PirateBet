import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['aff'],
  async execute(msg: Message) {
    let user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await db.insert(users).values({
        discordId: msg.author.id,
        username: msg.author.username,
        affiliateCode: code,
      });
      user = await db.query.users.findFirst({
        where: eq(users.discordId, msg.author.id),
      });
    }

    const referred = await db.query.users.findMany({
      where: eq(users.affiliatedBy, user!.affiliateCode),
    });

    let earnings = 0;
    for (const ref of referred) {
      earnings += Number(ref.totalWagered) * 0.05;
    }

    const embed = baseEmbed()
      .setTitle('🔗 Affiliate Program')
      .addFields(
        { name: 'Your Code', value: `\`${user!.affiliateCode}\``, inline: false },
        { name: 'Referrals', value: String(referred.length), inline: true },
        { name: 'Earnings (5%)', value: `$${earnings.toFixed(2)}`, inline: true },
      )
      .setFooter({ text: 'Share your code to earn 5% of referral wagers' });

    msg.reply({ embeds: [embed] });
  },
};
