import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['rl'],
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.roulette <amount> <bet: red|black|green|1-36|1to12|columns>`');
    }

    const embed = baseEmbed()
      .setTitle('🎰 Roulette')
      .setDescription('Place your bets')
      .addFields(
        { name: 'Bet', value: args.slice(1).join(' '), inline: true },
        { name: 'Amount', value: `$${args[0]}`, inline: true },
      )
      .setFooter({ text: 'Spinning...' });

    msg.reply({ embeds: [embed] });
  },
};
