// imports
const Discord = require('discord.js');
const imageGeneration = require('../utils/imageGeneration');
// exports
module.exports = {
    async execute(message) {
            const shortname = message.member.displayName.split(' ').join('').substring(0, 8);
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
