import { Message } from 'discord.js';
import { db, house } from '@workspace/db';
import { generateHouseBalanceCard } from '../utils/canvas';

export default {
  async execute(msg: Message) {
    const h = await db.query.house.findFirst();

    if (!h) {
      return msg.reply('❌ House data not found.');
    }

    const ltcBalance = (Number(h.balance) / 25).toFixed(4);
    const solBalance = (Number(h.balance) / 5).toFixed(4);
    const usdTotal = h.balance;

    const card = await generateHouseBalanceCard(ltcBalance, solBalance, String(usdTotal));

    msg.reply({
      files: [{ attachment: card, name: 'hb.png' }],
    });
  },
};
