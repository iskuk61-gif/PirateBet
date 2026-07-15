import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['wardice'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.ward <amount>`');
    }

    const embed = baseEmbed()
      .setTitle('⚓ Ward Dice')
      .setDescription('Roll higher than the pirate dealer')
      .addFields(
        { name: 'Your Roll', value: Math.floor(Math.random() * 100 + 1).toString(), inline: true },
        { name: 'Dealer Roll', value: Math.floor(Math.random() * 100 + 1).toString(), inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
