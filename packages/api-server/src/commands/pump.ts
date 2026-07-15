import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['pu'],
  async execute(msg: Message, args: string[]) {
    if (!args[0]) {
      return msg.reply('Usage: `.pump <amount>`');
    }

    const embed = baseEmbed()
      .setTitle('💨 Pump')
      .setDescription('Hold the button to increase multiplier, release before it bursts!')
      .addFields(
        { name: 'Multiplier', value: '1.00x', inline: true },
        { name: 'Bet', value: `$${args[0]}`, inline: true },
      )
      .setFooter({ text: 'Hold: 🔘 Release: ⏹️' });

    msg.reply({ embeds: [embed] });
  },
};
