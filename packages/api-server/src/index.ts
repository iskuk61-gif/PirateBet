import 'dotenv/config';
import express from 'express';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { db } from '@workspace/db';
import { registerCommands } from './commands/index';
import { startCrashGame } from './games/crash';
import { startSlideGame } from './games/slide';
import { startDepositMonitors } from './monitors/deposits';
import { startWithdrawalMonitor } from './monitors/withdrawals';
import { startKeepAlive, recordActivity } from './monitors/keepalive';
import { startLeaderboardMonitor } from './monitors/leaderboard';

const app = express();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

app.use(express.json());

app.get('/api/healthz', (req, res) => {
  res.json({ ok: true });
});

app.get('/ping', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

const startTime = Date.now();

client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user?.tag}`);

  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID!);
  if (!guild) {
    console.error('❌ Guild not found!');
    process.exit(1);
  }

  await registerCommands(client);

  startCrashGame(client);
  startSlideGame(client);
  startDepositMonitors(client);
  startWithdrawalMonitor(client);
  startKeepAlive(client);
  startLeaderboardMonitor(client);

  client.user?.setActivity('🏴‍☠️ .help for commands', { type: 0 });

  console.log('🎰 PirateBet bot ready!');
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot || !msg.content.startsWith('.')) return;

  recordActivity();

  const [cmd, ...args] = msg.content.slice(1).split(/\s+/);
  const command =
    client.commands?.get(cmd.toLowerCase()) ||
    client.commands?.get(client.aliases?.get(cmd.toLowerCase()));

  if (!command) return;

  try {
    await command.execute(msg, args, client);
  } catch (error) {
    console.error(error);
    msg.reply('❌ An error occurred.').catch(() => {});
  }
});

client.on('error', (error) => {
  console.error('Discord client error:', error);
  if (error.message.includes('token')) {
    console.error('❌ Token error - exiting to restart...');
    process.exit(1);
  }
});

client.commands = new Collection();
client.aliases = new Collection();

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('Failed to login:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    client.destroy();
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    client.destroy();
    process.exit(0);
  });
});
