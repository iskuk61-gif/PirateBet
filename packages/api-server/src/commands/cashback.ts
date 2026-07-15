import { Message } from 'discord.js';
import { db, users, commandCooldowns } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import { baseEmbed, winEmbed } from '../utils/embeds';

export default {
  aliases: ['cb'],
  async execute(msg: Message) {
    let user = await db.query.users.findFirst({
      where: eq(users.discordId, msg.author.id),
    });

    if (!user) {
      return msg.reply('❌ Account not found.');
    }

    const cooldown = await db.query.commandCooldowns.findFirst({
      where: and(
        eq(commandCooldowns.discordId, msg.author.id),
        eq(commandCooldowns.command, 'cashback'),
      ),
    });

    if (cooldown && new Date(cooldown.expiresAt) > new Date()) {
      return msg.reply(`❌ Cooldown active. Try again <t:${Math.floor(new Date(cooldown.expiresAt).getTime() / 1000)}:R>`);
    }

    const cashback = Number(user.totalWagered) * 0.05;
    if (cashback <= 0) {
      return msg.reply('❌ No cashback available.');
    }

    await db.update(users)
      .set({ balance: `${Number(user.balance) + cashback}` })
      .where(eq(users.discordId, msg.author.id));

    const expiresAt = new Date();
    if (cooldown) {
      await db.update(commandCooldowns)
        .set({ expiresAt })
        .where(and(
          eq(commandCooldowns.discordId, msg.author.id),
          eq(commandCooldowns.command, 'cashback'),
        ));
    } else {
      await db.insert(commandCooldowns).values({
        discordId: msg.author.id,
        command: 'cashback',
        expiresAt,
      });
    }

    const embed = winEmbed()
      .setTitle('💰 Cashback Claimed')
      .addFields({ name: 'Amount', value: `+$${cashback.toFixed(2)}`, inline: true });

    msg.reply({ embeds: [embed] });
  },
};
