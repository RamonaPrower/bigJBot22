// imports
const messageLink = require('../utils/messagelink');
// exports
module.exports = {
    async execute(message) {
        if (message.content.length > 6) {
        const foundMessage = await messageLink.getLinkObject(message.content, message.client);
                if (foundMessage.found === false) {
                    message.author.send(foundMessage.reason);
                }
                else {
                    applyReaction(foundMessage.message);
                }
        }
        else {
            message.channel.fetchMessages({
				limit: 1,
				before: message.id,
			})
				.then(async messages => {
					const lastMessage = await messages.first();
                    applyReaction(lastMessage);
				});
        }
         },
};

async function applyReaction(foundMessage) {
    const message = foundMessage;
            await message.react('🇳');
            await message.react('🇮');
            await message.react('🇨');
            await message.react('🇪');
}

module.exports.info = {
    name: 'Get Link',
    description: 'Get Link',
    summon: 'Post a discord message link',
};
// eslint-disable-next-line no-useless-escape
module.exports.regexp = /^!nice($| )/mi;