import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.tower <amount> <easy|medium|hard|extreme>`');
    }

    const amount = parseFloat(args[0]);
    const difficulty = args[1].toLowerCase();

    if (!['easy', 'medium', 'hard', 'extreme'].includes(difficulty)) {
      return msg.reply('❌ Invalid difficulty.');
    }

    const embed = baseEmbed()
      .setTitle('🗼 Tower')
      .setDescription(`Climbing ${difficulty} tower with $${amount}`)
      .addFields({ name: 'Level', value: '1/10', inline: true })
      .setFooter({ text: 'Click a safe tile or cash out' });

    msg.reply({ embeds: [embed] });
  },
};
