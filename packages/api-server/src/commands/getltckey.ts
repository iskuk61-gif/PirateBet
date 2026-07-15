import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    const allUsers = await db.query.users.findMany();
    const ltcUsers = allUsers.filter(u => u.ltcAddress).map(u => `${u.username}: ${u.ltcAddress}`);

    const embed = baseEmbed()
      .setTitle('🔑 LTC Deposit Addresses')
      .setDescription(ltcUsers.length === 0 ? 'None' : ltcUsers.join('\n'))
      .setFooter({ text: `Total users: ${ltcUsers.length}` });

    msg.reply({ embeds: [embed] });
  },
};
