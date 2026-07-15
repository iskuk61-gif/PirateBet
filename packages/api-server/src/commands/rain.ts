import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (args.length < 2) {
      return msg.reply('Usage: `.rain <amount>`');
    }

    const amount = parseFloat(args[0]);
    const sender = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!sender || Number(sender.balance) < amount) {
      return msg.reply('❌ Insufficient balance.');
    }

    // Find users who sent messages in last 10 min
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;
    const messages = await msg.channel!.messages.fetch({ limit: 100 });
    const activeUsers = new Set<string>();

    messages.forEach(m => {
      if (!m.author.bot && m.createdTimestamp > tenMinutesAgo) {
        activeUsers.add(m.author.id);
      }
    });

    if (activeUsers.size === 0) {
      return msg.reply('❌ No active users to rain on.');
    }

    const perUser = amount / activeUsers.size;
    const embed = baseEmbed()
      .setTitle('🌧️ Rain!')
      .setDescription(`${msg.author.username} rained $${amount} on ${activeUsers.size} users!`)
      .addFields({ name: 'Per User', value: `$${perUser.toFixed(2)}`, inline: true });

    msg.reply({ embeds: [embed] });
  },
};
