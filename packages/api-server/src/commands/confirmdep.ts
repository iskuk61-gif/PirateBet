import { Message } from 'discord.js';
import { db, deposits } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (!args[0]) {
      return msg.reply('Usage: `.confirmdep <txhash>`');
    }

    const dep = await db.query.deposits.findFirst({
      where: eq(deposits.txHash, args[0]),
    });

    if (!dep) {
      return msg.reply('❌ Deposit not found.');
    }

    await db.update(deposits)
      .set({ status: 'confirmed' })
      .where(eq(deposits.txHash, args[0]));

    const embed = winEmbed()
      .setTitle('✅ Deposit Confirmed')
      .addFields({ name: 'TX Hash', value: args[0], inline: false });

    msg.reply({ embeds: [embed] });
  },
};
