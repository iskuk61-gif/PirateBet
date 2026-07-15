import { Message } from 'discord.js';
import { db, redeemCodes } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    const subCmd = args[0]?.toLowerCase();

    if (subCmd === 'create' && args.length >= 4) {
      const code = args[1].toUpperCase();
      const amount = parseFloat(args[2]);
      const maxUses = parseInt(args[3]);

      await db.insert(redeemCodes).values({
        code,
        amount: String(amount),
        maxUses,
      });

      const embed = winEmbed()
        .setTitle('✅ Code Created')
        .addFields(
          { name: 'Code', value: code, inline: true },
          { name: 'Amount', value: `$${amount}`, inline: true },
          { name: 'Max Uses', value: String(maxUses), inline: true },
        );
      return msg.reply({ embeds: [embed] });
    }

    if (subCmd === 'list') {
      const codes = await db.query.redeemCodes.findMany();
      const embed = baseEmbed()
        .setTitle('📋 Redeem Codes')
        .setDescription(codes.length === 0 ? 'None' : codes.map(c => `${c.code}: $${c.amount} (${c.usedCount}/${c.maxUses})`).join('\n'));
      return msg.reply({ embeds: [embed] });
    }

    if (subCmd === 'delete' && args[1]) {
      await db.delete(redeemCodes).where(eq(redeemCodes.code, args[1].toUpperCase()));
      return msg.reply(`✅ Code ${args[1]} deleted.`);
    }

    msg.reply('Usage: `.code create <code> <amount> <uses>` or `.code list` or `.code delete <code>`');
  },
};
