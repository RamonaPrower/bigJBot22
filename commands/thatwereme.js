// imports
const Discord = require('discord.js');
const imageGeneration = require('../utils/imageGeneration');
const runes = require('runes');
// exports
module.exports = {
    async execute(message) {
            const removeSpacesFromName = message.member.displayName.split(' ').join('');
            const runeRespecter = runes(removeSpacesFromName);
            const shortname = runeRespecter.slice(0, 8).join('') + '21';
            const avatarURL = message.member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });
            const imageBuffer = await imageGeneration.thatWereMeImage(avatarURL, shortname);
            const attachment = new Discord.MessageAttachment(imageBuffer, 'godimme.png');
            message.channel.send(attachment);
            try {message.delete();}
			catch (error) {
				console.error(error);
			}
         },
};

module.exports.info = {
    name: 'god i wish that were me',
    description: 'For when you want to get into the boots of BigJB21',
    summon: 'saying "god i wish that was/were me", also via !god',
};
module.exports.regexp = /(^!god|^god i wish that (were|was) me($| $))/mi;
