import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['bj'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.blackjack <amount>`');
    }

    const amount = parseFloat(args[0]);
    const embed = baseEmbed()
      .setTitle('🃏 Blackjack')
      .setDescription(`Game started with $${amount} bet.`)
      .addFields(
        { name: 'Dealer Hand', value: '? + 6', inline: true },
        { name: 'Your Hand', value: 'K + 5 = 15', inline: true },
      )
      .setFooter({ text: 'Hit: .hit | Stand: .stand' });

    msg.reply({ embeds: [embed] });
  },
};
