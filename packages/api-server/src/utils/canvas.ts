import { createCanvas } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';

export async function generateBalanceCard(username: string, balance: string, rank: string): Promise<Buffer> {
  const canvas = createCanvas(400, 250);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(0, 0, 400, 250);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(username, 30, 60);

  ctx.font = '20px Arial';
  ctx.fillText(`Balance: $${balance}`, 30, 110);
  ctx.fillText(`Rank: ${rank}`, 30, 150);

  return canvas.toBuffer('image/png');
}

export async function generateStatsCard(username: string, wins: number, losses: number, wagered: string, cashback: string): Promise<Buffer> {
  const canvas = createCanvas(400, 300);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(0, 0, 400, 300);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`${username}'s Stats`, 30, 50);

  ctx.font = '18px Arial';
  ctx.fillText(`Wins: ${wins}`, 30, 100);
  ctx.fillText(`Losses: ${losses}`, 30, 135);
  ctx.fillText(`Wagered: $${wagered}`, 30, 170);
  ctx.fillText(`Cashback Earned: $${cashback}`, 30, 205);

  return canvas.toBuffer('image/png');
}

export async function generateHouseBalanceCard(ltcBal: string, solBal: string, usdTotal: string): Promise<Buffer> {
  const canvas = createCanvas(800, 420);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 800, 420);

  // Stars
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 420;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = Math.random();
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('⚓ PirateBet', 30, 50);

  // LTC Panel
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(50, 100, 300, 250);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('LTC Wallet', 70, 130);
  ctx.font = '18px Arial';
  ctx.fillText(ltcBal, 70, 180);
  ctx.font = '14px Arial';
  ctx.fillText('$25 per LTC', 70, 210);

  // SOL Panel
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(450, 100, 300, 250);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('SOL Wallet', 470, 130);
  ctx.font = '18px Arial';
  ctx.fillText(solBal, 470, 180);
  ctx.font = '14px Arial';
  ctx.fillText('$5 per SOL', 470, 210);

  // Total
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`Total: $${usdTotal}`, 300, 390);

  // Timestamp
  ctx.font = '12px Arial';
  ctx.fillStyle = '#888888';
  ctx.fillText(new Date().toLocaleString(), 30, 410);

  return canvas.toBuffer('image/png');
}
