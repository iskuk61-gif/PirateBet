import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  aliases: ['forcelose'],
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (args[0] === 'list') {
      const losers = await db.query.users.findMany({
        where: eq(users.forceLoser, true),
      });

      const embed = baseEmbed()
        .setTitle('🚫 Force-Lose Users')
        .setDescription(losers.length === 0 ? 'None' : losers.map(u => `• ${u.username}`).join('\n'));

      return msg.reply({ embeds: [embed] });
    }

    const target = msg.mentions.first();
    if (!target) return msg.reply('❌ Please mention a user.');

    const user = await db.query.users.findFirst({
      where: eq(users.discordId, target.id),
    });

    if (user) {
      await db.update(users)
        .set({ forceLoser: !user.forceLoser })
        .where(eq(users.discordId, target.id));

      msg.reply(`${user.forceLoser ? '✅ Removed' : '🚫 Added'} ${target.username} from force-lose list.`);
    }
  },
};
