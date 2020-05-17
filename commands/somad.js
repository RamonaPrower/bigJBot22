// imports
const Discord = require('discord.js');
const imageGeneration = require('../utils/imageGeneration');
// exports
module.exports = {
    async execute(message) {
		const avatarURL = message.member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });
		const imageBuffer = await imageGeneration.soMadImage(avatarURL);
		const attachment = new Discord.MessageAttachment(imageBuffer, 'custommad.png');
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
    name: '!somad',
    description: 'Generate a Image related to the "Tip: i am so fucking mad" meme',
    summon: 'type !somad',
};
module.exports.regexp = /^!somad/mi;