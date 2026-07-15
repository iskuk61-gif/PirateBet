import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.mines <amount> <mines_count>`');
    }

    const amount = parseFloat(args[0]);
    const minesCount = parseInt(args[1]);

    if (minesCount < 1 || minesCount > 20) {
      return msg.reply('❌ Mines must be between 1 and 20.');
    }

    const embed = baseEmbed()
      .setTitle('💣 Mines')
      .setDescription(`Click tiles to reveal. Avoid ${minesCount} mines on a 5x5 grid.`)
      .addFields(
        { name: 'Bet', value: `$${amount}`, inline: true },
        { name: 'Mines', value: String(minesCount), inline: true },
        { name: 'Safe Tiles', value: String(25 - minesCount), inline: true },
      )
      .setFooter({ text: 'Click a tile to start' });

    msg.reply({ embeds: [embed] });
  },
};
