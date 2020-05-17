// imports
const imageGeneration = require('../utils/imageGeneration');
const Discord = require('discord.js');
// exports
module.exports = {
	async execute(message) {
		const { names } = cleanName(message);
		const avatarURL = message.member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });
		const imageBuffer = await imageGeneration.unfollowMeImage(avatarURL, names);
		const attachment = new Discord.MessageAttachment(imageBuffer, 'customunfollow.png');
		message.channel.send(attachment);
		try {
			message.delete();
		}
		catch (error) {
			console.error(error);
		}
	},
};

function cleanName(message) {
	const names = new Array();
	// if the display name is over 30 characters, cut it
	if (message.member.displayName >= 30) {
		console.log('big name');
		names.push(message.member.displayName.substr(0, 30));
	}
	else {
		names.push(message.member.displayName);
	}
	// remove the number tag, use that as a username
	names.push(message.member.user.tag.substr(0, message.member.user.tag.length - 5));
	return { names };
}

module.exports.info = {
	name: '!unfollowme',
	description: 'Puts your user into the "unfollow me now" tweet from Tyler the Creator',
	summon: 'type !unfollowme',
};
module.exports.regexp = /^!unfollowme$/mi;