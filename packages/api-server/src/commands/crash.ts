import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['cr'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.crash <amount>`');
    }

    const embed = baseEmbed()
      .setTitle('📈 Crash')
      .setDescription('Place your bet before the multiplier crashes!')
      .addFields(
        { name: 'Current Multiplier', value: '1.00x', inline: true },
        { name: 'Your Bet', value: `$${args[0]}`, inline: true },
      )
      .setFooter({ text: 'Join the next round in #crash' });

    msg.reply({ embeds: [embed] });
  },
};
