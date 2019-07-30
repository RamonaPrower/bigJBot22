// imports
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const date = require('date-and-time');
// exports
module.exports = {
	async execute(message) {
		const { names } = cleanName(message);
		const { dateTimeFin } = formatDate();
		Canvas.registerFont('./fonts/SegoeUI.ttf', { family: 'Segoe UI' });
		Canvas.registerFont('./fonts/SegoeUIBold.ttf', { family: 'Segoe UI', weight: 'bold' });
		const canvas = Canvas.createCanvas(573, 331);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./images/unfollowme.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.beginPath();
		ctx.arc(30, 35, 24, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		const {
			body: buffer,
		} = await snekfetch.get(message.member.user.displayAvatarURL);
		const avatar = await Canvas.loadImage(buffer);
		ctx.drawImage(avatar, 6, 11, 48, 48);
		ctx.restore();
		ctx.font = 'bold 18px "Segoe UI",Arial,sans-serif';
		ctx.fillStyle = '#ffffff';
		// top name
		ctx.fillText(`${names[0]}`, 63, 30);
		ctx.font = '14px "Segoe UI",Arial,sans-serif';
		ctx.fillStyle = '#8899a6';
		// username
		ctx.fillText(`@${names[1]}`, 63, 52);
		// date and time
		ctx.fillText(dateTimeFin, 6, 228);

		const attachment = new Discord.Attachment(canvas.toBuffer(), 'customunfollow.png');
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

function formatDate() {
	const now = new Date();
	const timeRaw = date.format(now, 'h:m A');
	const timeBig = timeRaw.toUpperCase();
	const dateTimeFin = `${timeBig} - ${date.format(now, 'D MMM YYYY')}`;
	return { dateTimeFin };
}

module.exports.info = {
	name: '!unfollowme',
	description: 'Puts your user into the "unfollow me now" tweet from Tyler the Creator',
	summon: 'type !unfollowme',
};
module.exports.regexp = /^!unfollowme$/mi;