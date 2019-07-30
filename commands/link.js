// imports
const messageLink = require('../utils/messagelink');
// exports
module.exports = {
    async execute(message) {
        const foundMessage = await messageLink.getLinkObject(message.content, message.client);
        if (foundMessage.found === false) {
            console.log(foundMessage.reason);
        }
        console.log(foundMessage.message.content);
         },
};
module.exports.info = {
    name: 'Get Link',
    description: 'Get Link',
    summon: 'Post a discord message link',
};
// eslint-disable-next-line no-useless-escape
module.exports.regexp = /^https:\/\/discordapp.com\/channels\/\d+\/\d+\/\d+$/mi;