import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (!args[0]) {
      return msg.reply('Usage: `.addrlookup <address>`');
    }

    const embed = baseEmbed()
      .setTitle('🔍 Address Lookup')
      .addFields(
        { name: 'Address', value: `\`${args[0]}\``, inline: false },
        { name: 'Owner', value: 'Unknown', inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
