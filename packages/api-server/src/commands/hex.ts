import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (!args[0]) {
      return msg.reply('Usage: `.hex <txhash>`');
    }

    const embed = baseEmbed()
      .setTitle('🔍 Transaction Details')
      .setDescription('(Mock lookup)')
      .addFields(
        { name: 'Hash', value: `\`${args[0]}\``, inline: false },
        { name: 'Status', value: 'Confirmed', inline: true },
        { name: 'Amount', value: '0.1 BTC', inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
