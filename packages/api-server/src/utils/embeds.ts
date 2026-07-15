import { EmbedBuilder } from 'discord.js';

export function baseEmbed() {
  return new EmbedBuilder().setColor(0x1e3a5f);
}

export function winEmbed() {
  return new EmbedBuilder().setColor(0x22c55e);
}

export function loseEmbed() {
  return new EmbedBuilder().setColor(0xff3333);
}

export function ownerEmbed() {
  return new EmbedBuilder().setColor(0x1e3a5f);
}
