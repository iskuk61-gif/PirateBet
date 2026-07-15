import { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

interface CrashGame {
  multiplier: number;
  isCrashed: boolean;
  timeRemaining: number;
  bets: Map<string, number>;
}

let game: CrashGame = {
  multiplier: 1.0,
  isCrashed: false,
  timeRemaining: 0,
  bets: new Map(),
};

export function startCrashGame(client: Client) {
  setInterval(() => {
    if (!game.isCrashed) {
      game.multiplier += Math.random() * 0.05;
      if (Math.random() < 0.02) {
        game.isCrashed = true;
        game.multiplier = 0;
        game.bets.clear();
      }
    } else {
      game = {
        multiplier: 1.0,
        isCrashed: false,
        timeRemaining: 30,
        bets: new Map(),
      };
    }
  }, 1000);
}
