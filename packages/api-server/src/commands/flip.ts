import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed, winEmbed, loseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.flip <amount> <h|t>`');
    }

    const amount = parseFloat(args[0]);
    const choice = args[1].toLowerCase();

    if (choice !== 'h' && choice !== 't') {
      return msg.reply('❌ Choose `h` (heads) or `t` (tails).');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user || Number(user.balance) < amount) {
      return msg.reply('❌ Insufficient balance.');
    }

    const flip = Math.random() < 0.5 ? 'h' : 't';
    const wins = flip === choice;
    const winAmount = wins ? amount * 1.98 : 0;

    await db.update(users)
      .set({
        balance: wins ? `${Number(user.balance) + amount * 0.98}` : `${Number(user.balance) - amount}`,
        totalWagered: `${Number(user.totalWagered) + amount}`,
      })
      .where(eq(users.discordId, msg.author.id));

    const embed = (wins ? winEmbed() : loseEmbed())
      .setTitle(wins ? '✅ You Won!' : '❌ You Lost')
      .addFields(
        { name: 'Flip', value: flip === 'h' ? 'Heads' : 'Tails', inline: true },
        { name: 'Bet', value: `$${amount}`, inline: true },
        { name: 'Result', value: wins ? `+$${amount * 0.98}` : `-$${amount}`, inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
