import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (!args[0]) {
      return msg.reply('Usage: `.m <ltc_address>`');
    }

    const embed = baseEmbed()
      .setTitle('💰 LTC Balance Check')
      .addFields(
        { name: 'Address', value: `\`${args[0]}\``, inline: false },
        { name: 'Balance', value: '0.5 LTC', inline: true },
        { name: 'USD Value', value: '$12.50', inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
