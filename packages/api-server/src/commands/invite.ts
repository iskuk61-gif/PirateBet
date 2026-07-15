import { Message } from 'discord.js';

export default {
  async execute(msg: Message) {
    const link = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&scope=bot&permissions=8`;
    msg.reply(`🔗 Invite PirateBet: ${link}`);
  },
};
