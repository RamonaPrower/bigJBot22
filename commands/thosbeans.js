// imports
const imageGeneration = require('../utils/imageGeneration');
const Discord = require('discord.js');
// exports
module.exports = {
    async execute(message) {
        const shortname = message.member.displayName.substring(0, 20);
        const avatarURL = message.member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });
        const imageBuffer = await imageGeneration.thosBeansImage(avatarURL, shortname);
        const attachment = new Discord.MessageAttachment(imageBuffer, 'thosbeans.png');
        message.channel.send(attachment);
        try {
            message.delete();
        }
 catch (error) {
            console.error(error);
        }
    },

};
module.exports.info = {
    name: 'thinkin about thos beans',
    description: 'For when the beans are being thought about',
    summon: '!thosbeans or "thinkin about thos beans"',
};
module.exports.regexp = /^(!thosbeans|thinkin about thos beans)/mi;
