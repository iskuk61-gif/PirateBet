import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message) {
    const embed = baseEmbed()
      .setTitle('ℹ️ House Edge Info')
      .setDescription(
        'All games have a 2% house edge built into payouts. The house ensures long-term profitability while players can still win big!'
      )
      .addFields(
        { name: '🎲 Dice', value: 'Roll >50 for high (1.98x)', inline: true },
        { name: '🪙 Flip', value: 'Heads or tails (1.98x)', inline: true },
        { name: '📈 Market', value: 'Predict price direction (1.98x)', inline: true },
        { name: '⚠️ Min Bet', value: '$0.01', inline: true },
        { name: '💰 Wager Lock', value: '1x deposits before withdraw', inline: true },
      )
      .setFooter({ text: 'Play responsibly. House always wins in the long run.' });

    msg.reply({ embeds: [embed] });
  },
};
