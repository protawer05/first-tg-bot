const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const TOKEN = '5523451140:AAHXpAFh6yU9kNo4Ll38Fu_iHNpmOYdBtP8';

const bot = new TelegramApi(TOKEN, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю тебе число от 0 до 10');
    const randomNum = Math.floor(Math.random()*(10-0) + 0);
    chats[chatId] = randomNum;
    return bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/me', description: 'Информация о вас'},
        {command: '/game', description: 'Начинаем игру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        switch(text){
            case '/start':
                return bot.sendMessage(chatId, 'Добро пожаловать в моего первого телеграм бота');
            case '/me': 
               await bot.sendMessage(chatId, `Твой ник ${msg.from.first_name}`);
               await bot.sendMessage(chatId, 'Проверка на бота...');
                setTimeout(() => bot.sendMessage(chatId, !msg.from.is_bot ? 'Пройдена' : 'Не пройдена'), 3000)
                break;
            case '/game':
                startGame(chatId);
                break;
            default: 
               return bot.sendMessage(chatId, `Зачем ты мне говоришь что "${text}"`);
        }
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.from.id;
        if (data === '/again'){
            bot.sendMessage(chatId, 'Очистка чата');
            for(let i = 10; i > 0; i--){
                bot.sendMessage(chatId, 'НЕГРЫ ПИ******' );
            }
            return startGame(chatId);
        }
        if (data == chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Неааа... я загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}
start();