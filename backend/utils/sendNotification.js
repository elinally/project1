import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

const sendNotification = async (username, message) => {
    try {
        await bot.sendMessage(username, message);
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
};

bot.onText(/\/verify (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const email = match[1];

    try {
        const user = await User.findOneAndUpdate({ email: email}, { isActive: true });
        if (user) {
            bot.sendMessage(chatId,` User ${email} has been verified.`);
        } else {
            bot.sendMessage(chatId, `User ${email} not found.`);
        }
    } catch (error) {
        bot.sendMessage(chatId, 'Error verifying user.');
        console.error('Error verifying user:', error);
    }
});

export default sendNotification;