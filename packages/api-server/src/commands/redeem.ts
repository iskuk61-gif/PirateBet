import { Message } from 'discord.js';
import { db, users, redeemCodes } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.redeem <code>`');
    }

    const code = await db.query.redeemCodes.findFirst({
      where: eq(redeemCodes.code, args[0].toUpperCase()),
    });

    if (!code || !code.active || code.usedCount >= code.maxUses) {
      return msg.reply('❌ Invalid or expired code.');
    }

    let user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      await db.insert(users).values({
        discordId: msg.author.id,
        username: msg.author.username,
      });
      user = await db.query.users.findFirst({
        where: eq(users.discordId, msg.author.id),
      });
    }

    await db.update(users)
      .set({ balance: `${Number(user!.balance) + Number(code.amount)}` })
      .where(eq(users.discordId, msg.author.id));

    await db.update(redeemCodes)
      .set({ usedCount: code.usedCount + 1 })
      .where(eq(redeemCodes.id, code.id));

    const embed = winEmbed()
      .setTitle('🎁 Code Redeemed')
      .addFields({ name: 'Amount', value: `+$${code.amount}`, inline: true });

    msg.reply({ embeds: [embed] });
  },
};
