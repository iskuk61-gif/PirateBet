import { Message } from 'discord.js';
import { baseEmbed, ownerEmbed } from '../utils/embeds';

export default {
  aliases: ['ownerhelp'],
  async execute(msg: Message) {
    if (msg.author.id !== process.env.OWNER_ID) {
      return msg.reply('❌ Owner only.');
    }

    const embed = ownerEmbed()
      .setTitle('👑 Owner Commands')
      .addFields(
        { name: 'Balance', value: '.addbal @user <amt>\n.d @user <amt> (logdep)\n.w @user <amt> (logwith)\n.allowwithdraw @user (aw)', inline: false },
        { name: 'Admin', value: '.resetbalances confirm\n.resetstats confirm\n.forcecredit <txhash>\n.checkbalances\n.confirmdep <txhash>', inline: false },
        { name: 'Crypto', value: '.hex <txhash> (tx)\n.m <ltc_addr> (ltcbal)\n.getsolkey\n.getltckey', inline: false },
        { name: 'House', value: '.withdrawhouse <amt> <addr> (whouse)\n.code create <code> <amt> <uses>\n.code list\n.code delete <code>', inline: false },
        { name: 'Moderation', value: '.fl @user (forcelose)\n.fl list\n.setup\n.set <option>\n.ranksetup\n.delete #channel (delchan)', inline: false },
      );

    msg.reply({ embeds: [embed] });
  },
};
