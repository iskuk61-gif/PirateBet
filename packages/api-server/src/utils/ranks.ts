export function getRank(totalWagered: number): string {
  if (totalWagered < 100) return '🥉 Bronze';
  if (totalWagered < 500) return '🥈 Silver';
  if (totalWagered < 2000) return '🥇 Gold';
  if (totalWagered < 10000) return '💎 Platinum';
  return '👑 Diamond';
}
