import axios from 'axios';

let lastActivityTime = Date.now();

export function recordActivity() {
  lastActivityTime = Date.now();
}

export function startKeepAlive(client: Client) {
  setInterval(async () => {
    const timeSinceLastActivity = Date.now() - lastActivityTime;
    
    if (timeSinceLastActivity < 60 * 60 * 1000) { // 1 hour window
      try {
        const domain = process.env.REPLIT_DEV_DOMAIN || 'localhost:3000';
        await axios.get(`https://${domain}/ping`);
        console.log('✅ Keep-alive ping sent');
      } catch (error) {
        console.error('Keep-alive error:', error);
      }
    }
  }, 4 * 60 * 1000); // Every 4 minutes
}
