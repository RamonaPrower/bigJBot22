// imports
const Canvas = require('canvas');
const fs = require('fs');
const Botutils = require('../utils/botutils');
const {
	SpongebobImage,
} = require('../utils/spongebobImagePicker');

// exports
module.exports = {
	execute(message) {
		message.channel.startTyping();
		if (message.content.length > 11) {
			// if other text, get other content in message excluding command
			const splitMessage = message.content.split(' ');
			splitMessage.shift();
			const imageMessage = splitMessage.join(' ');
			checkMessage(message, imageMessage);
		}
		else {
			// this is when it's just the command, it'll skip back a message
			message.channel.fetchMessages({
					limit: 1,
					before: message.id,
				})
				.then(async messages => {
					const lastMessage = await messages.first();
					const imageMessage = lastMessage.content;
					checkMessage(message, imageMessage);
				});
		}
	},
};

function checkMessage(message, imageMessage) {
	if (imageMessage.length > 50) {
		cancelMessage(message, 'that message is too long! 50 characters or less, b-baka!');
		return;
	}
	// this checks for custom emojis from Botutils
	else if (Botutils.regex.emoji.test(message)) {
		cancelMessage(message, 'that message has emojis in! I can\'t handle those!!');
		return;
	}
 else {
		renderCreditsImage(message, imageMessage);
	}

}

function cancelMessage(message, errmessage) {
	message.channel.send(errmessage);
	message.channel.stopTyping();
	return;
}

async function renderCreditsImage(message, imageMessage) {
	// register font
	const SBimage = new SpongebobImage(message.member.displayName, imageMessage);
	const creditCanvas = await SBimage.generateCredits();
	const out = fs.createWriteStream(SBimage.creditsCardUri);
	const stream = creditCanvas.createPNGStream();
	await stream.pipe(out);
	// after the image is finished and saved
	out.on('finish', () => renderTitleCardImage(message, imageMessage, SBimage));
}

async function renderTitleCardImage(message, imageMessage, SBimage) {
	const lines = calculateLines(imageMessage, 60, 640, 480, 75);
	const titleImage = await SBimage.generateTitlecard(lines);
	const out = fs.createWriteStream(SBimage.titlecardUri);
	const stream = titleImage.createPNGStream();
	await stream.pipe(out);
	out.on('finish', () => renderTitleCardVideo(message, SBimage));
}

async function renderTitleCardVideo(message, SBimage) {
	const titleUri = await SBimage.generateTitleVideo();
	console.log(titleUri);
	message.channel.send({
		files: [{
			attachment: titleUri,
			name: 'SpongebobIntro.mp4',
		}],
	})
	.then(setTimeout(() => {
		SBimage.cleanup();
	}, 5000));

	message.channel.stopTyping();
}

function calculateLines(text, fontSize, canvasx, canvasy, paddingx) {
	// create dummy canvas and put variables in the place
	const canvas2 = Canvas.createCanvas(canvasx, canvasy);
	const ctx2 = canvas2.getContext('2d');
	const max_width = canvasx - paddingx;
	let width = 0,
		i, j;
	let result;
	const lines = [];

	// Font and size is required for ctx.measureText()
	ctx2.font = fontSize + 'px "Some Time Later"';


	// Start calculation
	while (text.length) {
		for (i = text.length; ctx2.measureText(text.substr(0, i)).width > max_width; i--);

		result = text.substr(0, i);

		if (i !== text.length) {
			for (j = 0; result.indexOf(' ', j) !== -1; j = result.indexOf(' ', j) + 1);
		}

		lines.push(result.substr(0, j || result.length));
		width = Math.max(width, ctx2.measureText(lines[lines.length - 1]).width);
		text = text.substr(lines[lines.length - 1].length, text.length);
	}
	for (let k = 0; k < lines.length; k++) {
		lines[k].trim();
	}
	// return the lines array
	return lines;
}

module.exports.info = {
	name: '!spongebob',
	description: 'Generates a Spongebob version of text',
	summon: '!spongebob [with optional text if you want a custom one]',
};
module.exports.regexp = /^!spongebob/mi;