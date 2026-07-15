import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['c4'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.connect <amount>`');
    }

    const embed = baseEmbed()
      .setTitle('🔴 Connect 4')
      .setDescription('Compete against the bot')
      .addFields({ name: 'Bet', value: `$${args[0]}`, inline: true })
      .setFooter({ text: 'Drop pieces to connect 4' });

    msg.reply({ embeds: [embed] });
  },
};
