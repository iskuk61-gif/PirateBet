import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    const allUsers = await db.query.users.findMany();
    const solUsers = allUsers.filter(u => u.solAddress).map(u => `${u.username}: ${u.solAddress}`);

    const embed = baseEmbed()
      .setTitle('🔑 SOL Deposit Keys')
      .setDescription(solUsers.length === 0 ? 'None' : solUsers.join('\n'))
      .setFooter({ text: `Total users: ${solUsers.length}` });

    msg.reply({ embeds: [embed] });
  },
};
