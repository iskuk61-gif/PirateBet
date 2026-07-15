import { Client } from 'discord.js';
import { db, users, deposits } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import axios from 'axios';
import { baseEmbed, winEmbed } from '../utils/embeds';

const LTC_PRICE = 25; // $25 USD
const SOL_PRICE = 5; // $5 USD

export async function startDepositMonitors(client: Client) {
  setInterval(async () => {
    try {
      const allUsers = await db.query.users.findMany();

      for (const user of allUsers) {
        if (user.ltcAddress) {
          await checkLTCDeposits(client, user.discordId, user.ltcAddress);
        }
        if (user.solAddress) {
          await checkSOLDeposits(client, user.discordId, user.solAddress);
        }
        await new Promise(r => setTimeout(r, 3500)); // 3.5s delay
      }
    } catch (error) {
      console.error('Deposit monitor error:', error);
    }
  }, 15 * 60 * 1000); // Every 15 minutes
}

async function checkLTCDeposits(client: Client, discordId: string, ltcAddress: string) {
  try {
    const res = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${ltcAddress}`);
    const balance = res.data.balance / 1e8; // Convert from satoshis

    if (balance > 0) {
      const usdAmount = balance * LTC_PRICE;
      await db.update(users)
        .set({ balance: `${Number(await db.query.users.findFirst({ where: eq(users.discordId, discordId) })) + usdAmount}` })
        .where(eq(users.discordId, discordId));

      const user = await client.users.fetch(discordId).catch(() => null);
      if (user) {
        const embed = winEmbed()
          .setTitle('💰 LTC Deposit Received')
          .addFields(
            { name: 'Amount', value: `${balance} LTC = $${usdAmount.toFixed(2)}`, inline: true },
            { name: 'Address', value: ltcAddress, inline: false },
          );
        await user.send({ embeds: [embed] }).catch(() => {});
      }
    }
  } catch (error) {
    console.error('LTC deposit check error:', error);
  }
}

async function checkSOLDeposits(client: Client, discordId: string, solAddress: string) {
  try {
    // Solana RPC call
    const res = await axios.post('https://api.mainnet-beta.solana.com', {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [solAddress],
    });

    const balance = (res.data.result.value || 0) / 1e9; // Convert from lamports
    if (balance > 0) {
      const usdAmount = balance * SOL_PRICE;
      await db.update(users)
        .set({ balance: `${Number(await db.query.users.findFirst({ where: eq(users.discordId, discordId) })) + usdAmount}` })
        .where(eq(users.discordId, discordId));
    }
  } catch (error) {
    console.error('SOL deposit check error:', error);
  }
}
