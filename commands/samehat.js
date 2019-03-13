// imports
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');
// exports
module.exports = {
    async execute(message) {
        if (!message.mentions.users.size) {
			message.channel.fetchMessages({
				limit: 1,
				before: message.id,
			})
				.then(async messages => {
					const lastmessage = await messages.first();
					const otherHat = lastmessage.member.user;
					console.log('previous user');
					callHat(message, otherHat);
				});
		}
		else {
			const otherHat = message.mentions.users.first();
			console.log('mentioned user') /
                callHat(message, otherHat);
		}
		// create same hat image with rounded borders
		// catch errors
         }
}

async function callHat(message, otherHat) {
	const canvas = Canvas.createCanvas(471, 361);
	const ctx = canvas.getContext('2d');
	const background = await Canvas.loadImage('./images/samehat.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.beginPath();
	ctx.arc(127, 195, 40, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	const { body: buffer } = await snekfetch.get(message.member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 87, 155, 80, 80);
	ctx.restore();
	ctx.beginPath();
	ctx.arc(370, 208, 50, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	const { body: buffer2 } = await snekfetch.get(otherHat.displayAvatarURL);
	const avatar2 = await Canvas.loadImage(buffer2);
	ctx.drawImage(avatar2, 320, 158, 100, 100);
	const attachment = new Discord.Attachment(canvas.toBuffer(), 'samehat.png');
	message.channel.send(attachment);
}
module.exports.info = {
    name: '!samehat',
    description: 'Show someone that same hat feeling',
    summon: '!samehat [optional:Tag someone]'
}
module.exports.regexp = '^!samehat($| )'