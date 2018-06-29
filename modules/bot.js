const SlackBot = require('slackbots');

let users = [];
let channels = [];
let botUserId;

// Detect if this msg is directed to the bot
const isMessageToMe = (msg) => {
    // Only parse messages (not notifications, typing events etc..)
    return msg.type === 'message' 
        // Look for @bot references or messages in a direct message channel
        && (msg.text.includes(`<@${botUserId}>`) 
            || channels.filter(n => n.id === msg.channel).length > 0)
        // Don't accept messages that are from a bot
        && !msg.hasOwnProperty('bot_id');
};

const setupEvents = (bot, config) => {
    // When the bot starts up
    bot.on('start', () => {
        const params = {
            icon_emoji: ':cat:',
        };

        // Get a list of all users connected to Slack
        bot.getUsers().then((u) => {
            users = u.members;
            botUserId = users.filter(n => n.name === config.get('slackBotName'))[0].id;
        }).fail((err) => {
            console.error(err);
        });

        // Get a list of channels
        bot.getImChannels().then((ch) => {
            channels = ch.ims;
        }).fail((err) => {
            console.error(err);
        });

        // TODO. Join some channels
    });

    // When the bot detects a message on the RTM stream
    bot.on('message', (msg) => {
        if (isMessageToMe(msg)) {
            console.log('post message!');
            // Message was directed to this bot
            bot.postMessage(msg.channel, 'I got your msg ... maybe my programmer will make me smart enough to reply one day!');
        };
    });
}

module.exports = (config) => {
    const module = {};
    
    module.run = () => {
        // Configure bot
        const bot = new SlackBot({
            token: config.get('slackBotToken'),
            name: config.get('slackBotName'),
        });

        setupEvents(bot, config);
    }

    return module;
}