import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['mkt'],
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.market <amount> <up|down>`');
    }

    const direction = args[1].toLowerCase() === 'up' ? '📈 Up' : '📉 Down';
    const wins = Math.random() < 0.5;

    const embed = baseEmbed()
      .setTitle('💹 Market')
      .addFields(
        { name: 'Your Prediction', value: direction, inline: true },
        { name: 'Actual', value: wins ? direction : (direction.includes('Up') ? '📉 Down' : '📈 Up'), inline: true },
        { name: 'Result', value: wins ? '✅ Win 1.98x' : '❌ Lose', inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
