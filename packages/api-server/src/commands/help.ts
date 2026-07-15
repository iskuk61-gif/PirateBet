import { Message } from 'discord.js';
import { baseEmbed } from '../utils/embeds';

export default {
  async execute(msg: Message) {
    const embed = baseEmbed()
      .setTitle('🏴‍☠️ PirateBet - Command List')
      .addFields(
        { name: '💰 General', value: '.balance (b, bal)\n.deposit\n.depositsol\n.withdraw <amt> <addr>\n.tip @user <amt>\n.rain <amt>\n.rank\n.stats\n.history\n.leaderboard (lb)\n.daily\n.weekly\n.monthly\n.redeem <code>\n.affiliate (aff)\n.cashback (cb)\n.hb\n.uptime\n.invite\n.house', inline: true },
        { name: '🎮 Games', value: '.dice <amt> <high|low>\n.flip <amt> <h|t>\n.limbo <amt> <mult>\n.blackjack <amt> (bj)\n.hilo <amt>\n.mines <amt> <count>\n.roulette <amt> <bet> (rl)\n.tower <amt> <diff>\n.crash <amt> (cr)\n.lp <amt>\n.pump <amt>\n.market <amt> <up|down>\n.connect <amt>\n.ward <amt>\n.slide <amt>', inline: true },
      )
      .setFooter({ text: 'Prefix: . | House Edge: 2% | Min Bet: $0.01' });

    msg.reply({ embeds: [embed] });
  },
};
