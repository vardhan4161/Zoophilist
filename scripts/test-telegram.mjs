const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken || !chatId) {
  console.log('Missing Telegram credentials in environment.');
  process.exit(0);
}

console.log('Testing Telegram connection for bot:', botToken.slice(0, 5) + '...');

try {
  const meResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
  const meData = await meResponse.json();
  console.log('Telegram Bot Info:', JSON.stringify(meData, null, 2));

  console.log('Testing access to chat:', chatId);
  const chatResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`);
  const chatData = await chatResponse.json();
  console.log('Telegram Chat Info:', JSON.stringify(chatData, null, 2));
} catch (err) {
  console.error('Telegram Connection Error:', err.message);
}
