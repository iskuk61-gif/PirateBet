import { Message } from 'discord.js';
import { db, users, withdrawals } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.withdraw <amount> <ltc_address>`');
    }

    const amount = parseFloat(args[0]);
    const ltcAddr = args[1];

    if (amount < 1) {
      return msg.reply('❌ Minimum withdrawal: $1');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user || Number(user.balance) < amount) {
      return msg.reply('❌ Insufficient balance.');
    }

    if (Number(user.totalWagered) < Number(user.balance) * 2) {
      return msg.reply('❌ Wager requirement not met. Must wager 1x your deposits.');
    }

    await db.insert(withdrawals).values({
      discordId: msg.author.id,
      ltcAddress: ltcAddr,
      amount: String(amount),
      status: 'pending',
    });

    const embed = baseEmbed()
      .setTitle('💸 Withdrawal Requested')
      .addFields(
        { name: 'Amount', value: `$${amount}`, inline: true },
        { name: 'Status', value: 'Pending', inline: true },
      )
      .setFooter({ text: 'You will be DM\'d when your withdrawal is confirmed.' });

    msg.reply({ embeds: [embed] });
  },
};
