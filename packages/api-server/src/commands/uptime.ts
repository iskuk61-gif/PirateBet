import { Message, Client } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

let botStartTime = Date.now();

export default {
  async execute(msg: Message, args: string[], client: Client) {
    const uptime = Date.now() - botStartTime;
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const latency = client.ws.ping;

    const embed = baseEmbed()
      .setTitle('⚡ Bot Status')
      .addFields(
        { name: 'Uptime', value: `${hours}h ${minutes}m`, inline: true },
        { name: 'Latency', value: `${latency}ms`, inline: true },
      );

    msg.reply({ embeds: [embed] });
  },
};
