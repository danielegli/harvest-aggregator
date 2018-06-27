const SlackBot = require('slackbots');

module.exports = (config) => {
    const module = {};

    // Configure bot
    const bot = new SlackBot({
        token: config.get('slackBotToken'),
        name: config.get('slackBotName'),
    });

    bot.on('start', () => {
        const params = {
            icon_emoji: ':cat:',
        };

        bot.getUsers().then((data) => {
            console.log('list of users: ', data);
        });

        // bot.postMessageToUser('daniel.egli', 'meow!', params);
    });

    module.run = () => {
        console.log('Start the bot!');
    }

    return module;
}