// imports

// exports
module.exports = {
    async execute(messageReaction) {
        if (messageReaction.message.cleanContent === 'nice') {
            const message = messageReaction.message;
            await message.react('🇮');
            await message.react('🇨');
            await message.react('🇪');
        }
        else {return;}
         },
};
module.exports.info = {
    name: 'Nice',
    description: 'Reaction to start Nice',
    summon: ':N: on a comment of "nice"',
};
module.exports.regexp = /🇳/mi;