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
	else if (Botutils.regex.emoji.test(message)) {
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
	// lines needs to be pushed to, so we set it up beforehand
	let lines = [];
	let canvasWidth = 0;
	let canvasHeight = 0;
	// calculates the canvas size based on the lines
	({ canvasWidth, canvasHeight, lines } = doStuffToFont(tweetMessage, 27, lines));
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

function doStuffToFont(text, fontSize, lines) {
	// create dummy canvas and put variables in the place
	const canvas2 = Canvas.createCanvas(631, 560);
	const ctx2 = canvas2.getContext('2d');
	const max_width = 560;
	let width = 0, i, j;
	let result;

	// Font and size is required for ctx.measureText()
	ctx2.font = fontSize + 'px "Segoe UI",Arial,sans-serif';


	// Start calculation
	while (text.length) {
		for(i = text.length; ctx2.measureText(text.substr(0, i)).width > max_width; i--);

		result = text.substr(0, i);

		if (i !== text.length) {for(j = 0; result.indexOf(' ', j) !== -1; j = result.indexOf(' ', j) + 1);}

		lines.push(result.substr(0, j || result.length));
		width = Math.max(width, ctx2.measureText(lines[ lines.length - 1 ]).width);
		text = text.substr(lines[ lines.length - 1 ].length, text.length);
	}


	// Calculate canvas size, add margin
	const canvasWidth = 631;
	const canvasHeight = 255 + (fontSize + 5) * lines.length;
	return { canvasWidth, canvasHeight, lines };
}

function renderFont(ctx, lines, fontSize) {
	// run ctx.filltext as many times as there is lines
	for (let i = 0, j = lines.length; i < j; ++i) {
		ctx.fillText(lines[i], 36, 100 + fontSize + (fontSize + 6) * i);
	}
}

function formatDate() {
	const now = new Date();
	const timeRaw = date.format(now, 'h:m A');
	const timeBig = timeRaw.toUpperCase();
	const dateTimeFin = `${timeBig} - ${date.format(now, 'D MMM YYYY')}`;
	return { dateTimeFin };
}
module.exports.info = {
	name: '!dril',
	description: 'Generates a dril tweet based on a new or last message',
	summon: '!dril [optional text here if you want a custom message]',
};
module.exports.regexp = '^!dril($| )';