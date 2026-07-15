import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.slide <amount>`');
    }

    const embed = baseEmbed()
      .setTitle('🎡 Slide')
      .setDescription('24/7 public wheel game')
      .addFields({ name: 'Bet', value: `$${args[0]}`, inline: true })
      .setFooter({ text: 'Place your bet in #slide' });

    msg.reply({ embeds: [embed] });
  },
};
