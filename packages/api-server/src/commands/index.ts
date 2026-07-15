import { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export async function registerCommands(client: Client) {
  const commandsPath = path.join(new URL('.', import.meta.url).pathname, '..');
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

  for (const file of commandFiles) {
    if (file === 'index.ts' || file === 'index.js') continue;
    try {
      const command = await import(path.join(commandsPath, file));
      if (command.default?.execute) {
        const name = file.replace(/\.(ts|js)$/, '');
        client.commands?.set(name, command.default);
        if (command.default.aliases) {
          command.default.aliases.forEach((alias: string) => client.aliases?.set(alias, name));
        }
      }
    } catch (err) {
      console.error(`Error loading command ${file}:`, err);
    }
  }
}
