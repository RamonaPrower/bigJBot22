// imports
const Discord = require('discord.js');
const Canvas = require('canvas');
const Botutils = require('../utils/botutils');
const date = require('date-and-time');
// exports
module.exports = {
	execute(message) {
		message.channel.startTyping();
		if (message.content.length > 5) {
			// if other text, get other content in message excluding command
			const splitMessage = message.content.split(' ');
			splitMessage.shift();
			const tweetMessage = splitMessage.join(' ');
			checkMessage(message, tweetMessage);
		}
		else {
			// this is when it's just the command, it'll skip back a message
			message.channel.fetchMessages({
				limit: 1,
				before: message.id,
			})
				.then(async messages => {
					const lastMessage = await messages.first();
					const tweetMessage = lastMessage.content;
					checkMessage(message, tweetMessage);
				});
		}
	},
};

function checkMessage(message, tweetMessage) {
	if (tweetMessage.length > 280) {
		cancelMessage(message, 'Tweets are only 280 characters max, silly!');
		return;
	}
	// this checks for custom emojis from Botutils
	else if (Botutils.emoji.test(message)) {
		cancelMessage(message, 'I can\'t do emojis yet! b-baka!');
		return;
	}
	else {
		renderImage(message, tweetMessage);
	}

}

function cancelMessage(message, errmessage) {
	message.channel.send(errmessage);
	message.channel.stopTyping();
	return;
}

async function renderImage(message, tweetMessage) {
	// register the font to the system
	Canvas.registerFont('./fonts/SegoeUI.ttf', { family: 'Segoe UI' });
	// calculates the canvas size based on the lines
	const { canvasWidth, canvasHeight, lines } = Botutils.drilNewLineCreator(tweetMessage, 27, 560);
	// const { canvasWidth, canvasHeight, lines } = doStuffToFont(tweetMessage, 27);
	if (lines.length === 0) {
		message.channel.stopTyping();
		message.channel.send('no');
		return;
	}
	// summon the date and time
	const { dateTimeFin } = formatDate();
	// create the canvas based on calcs, and fill with dark twitter thing
	const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgb(11,19,33)';
	ctx.fillRect(0, 0, 631, canvasHeight);
	// draw static images
	const topImage = await Canvas.loadImage('./images/driltop.png');
	ctx.drawImage(topImage, 0, 0);
	const bottomImage = await Canvas.loadImage('./images/drilbottom.png');
	ctx.drawImage(bottomImage, 0, canvasHeight - 145);
	// draw the tweet and the time and date
	ctx.font = '27px "Segoe UI",Arial,sans-serif';
	ctx.fillStyle = '#ffffff';
	renderFont(ctx, lines, 27);
	ctx.font = '14px "Segoe UI",Arial,sans-serif';
	ctx.fillStyle = '#8899a6';
	ctx.fillText(dateTimeFin, 36, canvasHeight - 120);
	// send attachment
	const attachment = new Discord.Attachment(canvas.toBuffer(), 'driltime.png');
	message.channel.send(attachment);
	message.channel.stopTyping();

}

function renderFont(ctx, lines, fontSize) {
	// run ctx.filltext as many times as there is lines
	for (let i = 0, j = lines.length; i < j; ++i) {
		ctx.fillText(lines[i], 36, 100 + fontSize + (fontSize + 7) * i);
	}
}

function formatDate() {
	const now = new Date();
	const timeRaw = date.format(now, 'h:mm A');
	const timeBig = timeRaw.toUpperCase();
	const dateTimeFin = `${timeBig} - ${date.format(now, 'D MMM YYYY')}`;
	return { dateTimeFin };
}
module.exports.info = {
	name: 'dril',
	description: 'Generates a dril tweet based on a new or last message',
	summon: '!dril [optional text here if you want a custom message]',
};
module.exports.regexp = /^!dril($| )/mi;