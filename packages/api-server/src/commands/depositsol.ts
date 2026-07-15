import { Message } from 'discord.js';
import { db, deposits, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (!args[0]) {
      return msg.reply('Usage: `.depositsol`');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    const embed = baseEmbed()
      .setTitle('💜 SOL Deposit Address')
      .addFields({
        name: 'Address',
        value: `\`\`\`${user?.solAddress || 'No address'}\`\`\``,
        inline: false,
      })
      .setFooter({ text: 'Price: SOL = $5 USD' });

    msg.reply({ embeds: [embed] });
  },
};
