import { Message, AttachmentBuilder } from 'discord.js';
import { db, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { baseEmbed } from '../utils/embeds';
import { deriveLTCAddress, deriveSOLKeypair } from '../utils/wallet';

export default {
  async execute(msg: Message, args: string[]) {
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

    let ltcAddr = user?.ltcAddress;
    let solAddr = user?.solAddress;
    const userIndex = user?.id || 0;

    if (!ltcAddr) {
      ltcAddr = deriveLTCAddress(process.env.LTC_XPUB!, userIndex);
      await db.update(users).set({ ltcAddress: ltcAddr }).where(eq(users.discordId, msg.author.id));
    }

    if (!solAddr) {
      const { publicKey } = deriveSOLKeypair(process.env.SOL_SEED!, userIndex);
      solAddr = publicKey;
      await db.update(users).set({ solAddress: solAddr }).where(eq(users.discordId, msg.author.id));
    }

    const embed = baseEmbed()
      .setTitle('💰 Your Deposit Addresses')
      .addFields(
        { name: '🔗 LTC Address', value: `\`\`\`${ltcAddr}\`\`\``, inline: false },
        { name: '🔗 SOL Address', value: `\`\`\`${solAddr}\`\`\``, inline: false },
        { name: 'Price', value: 'LTC = $25 USD\nSOL = $5 USD', inline: true },
      )
      .setFooter({ text: 'Deposits are credited automatically upon 1 confirmation' });

    msg.reply({ embeds: [embed] });
  },
};
