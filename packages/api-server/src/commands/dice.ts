import { Message } from 'discord.js';
import { db, users, bets, house } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed, winEmbed, loseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.dice <amount> <high|low>`');
    }

    const amount = parseFloat(args[0]);
    const choice = args[1].toLowerCase();

    if (choice !== 'high' && choice !== 'low') {
      return msg.reply('❌ Choose `high` or `low`.');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user || Number(user.balance) < amount) {
      return msg.reply('❌ Insufficient balance.');
    }

    const roll = Math.floor(Math.random() * 100) + 1;
    const wins = (choice === 'high' && roll > 50) || (choice === 'low' && roll <= 50);
    const winAmount = wins ? amount * 1.98 : 0;

    await db.update(users)
      .set({
        balance: wins ? `${Number(user.balance) + amount * 0.98}` : `${Number(user.balance) - amount}`,
        totalWagered: `${Number(user.totalWagered) + amount}`,
      })
      .where(eq(users.discordId, msg.author.id));

    await db.insert(bets).values({
      discordId: msg.author.id,
      game: 'dice',
      betAmount: String(amount),
      winAmount: String(winAmount),
      outcome: wins ? 'win' : 'lose',
      multiplier: '1.98',
    });

    const embed = (wins ? winEmbed() : loseEmbed())
      .setTitle(wins ? '🎲 You Won!' : '🎲 You Lost')
      .addFields(
        { name: 'Roll', value: `${roll}`, inline: true },
        { name: 'Bet', value: `$${amount}`, inline: true },
        { name: 'Result', value: wins ? `+$${amount * 0.98}` : `-$${amount}`, inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
