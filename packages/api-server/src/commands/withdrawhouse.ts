import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['whouse'],
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (args.length < 2) {
      return msg.reply('Usage: `.withdrawhouse <amount> <ltc_address>`');
    }

    const embed = baseEmbed()
      .setTitle('💼 House Withdrawal')
      .addFields(
        { name: 'Amount', value: `$${args[0]}`, inline: true },
        { name: 'Address', value: args[1], inline: true },
      )
      .setFooter({ text: 'Pending on-chain confirmation' });

    msg.reply({ embeds: [embed] });
  },
};
