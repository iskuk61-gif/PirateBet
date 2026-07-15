import { Message } from 'discord.js';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.limbo <amount> <target_multiplier>`');
    }

    const amount = parseFloat(args[0]);
    const target = parseFloat(args[1]);

    if (target < 1.01 || target > 100) {
      return msg.reply('❌ Target must be between 1.01 and 100.');
    }

    const roll = Math.random() * 100 + 1;
    const wins = roll >= target;
    const payout = wins ? amount * target : 0;

    const embed = (wins ? winEmbed() : baseEmbed().setColor(0xff3333))
      .setTitle(wins ? '🔥 You Won!' : '💨 Busted')
      .addFields(
        { name: 'Multiplier', value: `${roll.toFixed(2)}x`, inline: true },
        { name: 'Target', value: `${target}x`, inline: true },
        { name: 'Payout', value: wins ? `$${payout.toFixed(2)}` : 'Lost', inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
