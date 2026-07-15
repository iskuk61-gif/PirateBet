import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['hl'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.hilo <amount>`');
    }

    const embed = baseEmbed()
      .setTitle('📊 Hi-Lo')
      .setDescription('Predict if the next card is higher or lower')
      .addFields({ name: 'Current Card', value: '7 of Hearts', inline: false })
      .setFooter({ text: 'Higher: .higher | Lower: .lower' });

    msg.reply({ embeds: [embed] });
  },
};
