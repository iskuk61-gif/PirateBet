import { Message } from 'discord.js';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  aliases: ['lp'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.lp <amount>`');
    }

    const amount = parseFloat(args[0]);
    const m1 = (Math.random() * 5 + 1).toFixed(2);
    const m2 = (Math.random() * 5 + 1).toFixed(2);
    const m3 = (Math.random() * 5 + 1).toFixed(2);

    const embed = winEmbed()
      .setTitle('🎁 Lucky Pack')
      .addFields(
        { name: 'Card 1', value: `${m1}x`, inline: true },
        { name: 'Card 2', value: `${m2}x`, inline: true },
        { name: 'Card 3', value: `${m3}x`, inline: true },
      )
      .setFooter({ text: `Total payout: $${(amount * (parseFloat(m1) + parseFloat(m2) + parseFloat(m3)) / 3).toFixed(2)}` });

    msg.reply({ embeds: [embed] });
  },
};
