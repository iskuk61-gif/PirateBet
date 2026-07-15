import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.tip @user <amount>`');
    }

    const target = msg.mentions.first();
    const amount = parseFloat(args[1]);

    if (!target) {
      return msg.reply('❌ Please mention a user.');
    }

    if (amount <= 0) {
      return msg.reply('❌ Amount must be positive.');
    }

    const sender = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!sender || Number(sender.balance) < amount) {
      return msg.reply('❌ Insufficient balance.');
    }

    let receiver = await db.query.users.findFirst({
      where: eq(users.discordId, target.id),
    });

    if (!receiver) {
      await db.insert(users).values({
        discordId: target.id,
        username: target.username,
      });
      receiver = await db.query.users.findFirst({
        where: eq(users.discordId, target.id),
      });
    }

    await db.update(users)
      .set({ balance: `${Number(sender.balance) - amount}` })
      .where(eq(users.discordId, msg.author.id));

    await db.update(users)
      .set({ balance: `${Number(receiver!.balance) + amount}` })
      .where(eq(users.discordId, target.id));

    const embed = baseEmbed()
      .setTitle('💸 Tip Sent')
      .addFields(
        { name: 'From', value: msg.author.username, inline: true },
        { name: 'To', value: target.username, inline: true },
        { name: 'Amount', value: `$${amount}`, inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
