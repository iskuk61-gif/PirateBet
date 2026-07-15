import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (!args[0]) {
      return msg.reply('Usage: `.setup`');
    }

    const guild = msg.guild!;
    const channels = ['casino-games', 'game-history', 'withdrawals-deposits', 'crash', 'tutorial', 'leaderboard'];

    for (const channelName of channels) {
      const existing = guild.channels.cache.find(c => c.name === channelName);
      if (!existing) {
        await guild.channels.create({
          name: channelName,
          type: 0, // Text channel
        });
      }
    }

    const embed = baseEmbed()
      .setTitle('🎰 PirateBet Setup Complete')
      .setDescription('All casino channels have been created!')
      .addFields(
        { name: 'Channels', value: channels.join('\n'), inline: false },
      );

    msg.reply({ embeds: [embed] });
  },
};
