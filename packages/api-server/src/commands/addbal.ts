import { Message } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message, args: string[]) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    if (args.length < 2) {
      return msg.reply('Usage: `.addbal @user <amount>`');
    }

    const target = msg.mentions.first();
    const amount = parseFloat(args[1]);

    if (!target) return msg.reply('❌ Please mention a user.');

    let user = await db.query.users.findFirst({
      where: eq(users.discordId, target.id),
    });

    if (!user) {
      await db.insert(users).values({
        discordId: target.id,
        username: target.username,
      });
      user = await db.query.users.findFirst({
        where: eq(users.discordId, target.id),
      });
    }

    await db.update(users)
      .set({ balance: `${Number(user!.balance) + amount}` })
      .where(eq(users.discordId, target.id));

    const embed = baseEmbed()
      .setTitle('✅ Balance Updated')
      .addFields(
        { name: 'User', value: target.username, inline: true },
        { name: 'Added', value: `$${amount}`, inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
