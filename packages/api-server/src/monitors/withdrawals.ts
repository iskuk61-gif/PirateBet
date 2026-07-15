import { Client } from 'discord.js';
import { db, withdrawals } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';

export function startWithdrawalMonitor(client: Client) {
  setInterval(async () => {
    try {
      const pending = await db.query.withdrawals.findMany({
        where: eq(withdrawals.status, 'pending'),
      });

      for (const w of pending) {
        const age = Date.now() - (w.createdAt?.getTime() || 0);
        if (age > 10 * 60 * 1000) {
          await db.update(withdrawals)
            .set({ status: 'confirmed' })
            .where(eq(withdrawals.id, w.id));

          const user = await client.users.fetch(w.discordId).catch(() => null);
          if (user) {
            const embed = baseEmbed()
              .setTitle('✅ Withdrawal Confirmed')
              .addFields({ name: 'Amount', value: `$${w.amount}`, inline: true });
            await user.send({ embeds: [embed] }).catch(() => {});
          }
        }
      }
    } catch (error) {
      console.error('Withdrawal monitor error:', error);
    }
  }, 10 * 60 * 1000); // Every 10 minutes
}
