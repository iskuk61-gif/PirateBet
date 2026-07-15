import { Message } from 'discord.js';
import { db, users, commandCooldowns } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message) {
    let user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await db.insert(users).values({
        discordId: msg.author.id,
        username: msg.author.username,
        affiliateCode: code,
      });
      user = await db.query.users.findFirst({
        where: eq(users.discordId, msg.author.id),
      });
    }

    const cooldown = await db.query.commandCooldowns.findFirst({
      where: and(
        eq(commandCooldowns.discordId, msg.author.id),
        eq(commandCooldowns.command, 'monthly'),
      ),
    });

    if (cooldown && new Date(cooldown.expiresAt) > new Date()) {
      return msg.reply(`❌ Cooldown active. Try again <t:${Math.floor(new Date(cooldown.expiresAt).getTime() / 1000)}:R>`);
    }

    const amount = 0.50;
    await db.update(users)
      .set({ balance: `${Number(user!.balance) + amount}` })
      .where(eq(users.discordId, msg.author.id));

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    if (cooldown) {
      await db.update(commandCooldowns)
        .set({ expiresAt })
        .where(and(
          eq(commandCooldowns.discordId, msg.author.id),
          eq(commandCooldowns.command, 'monthly'),
        ));
    } else {
      await db.insert(commandCooldowns).values({
        discordId: msg.author.id,
        command: 'monthly',
        expiresAt,
      });
    }

    const embed = winEmbed()
      .setTitle('💎 Monthly Bonus Claimed')
      .addFields({ name: 'Amount', value: `+$${amount}`, inline: true });

    msg.reply({ embeds: [embed] });
  },
};
