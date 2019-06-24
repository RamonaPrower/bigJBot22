// imports
const Canvas = require('canvas');
const fs = require('fs');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
const Botutils = require('../utils/botutils');
const spongebobData = require('../strings/spongebob.json');
const config = require('../config.json');

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
		renderImage(message, imageMessage);
	}

}

function cancelMessage(message, errmessage) {
	message.channel.send(errmessage);
	message.channel.stopTyping();
	return;
}

async function renderImage(message, imageMessage) {
	// register font
	Canvas.registerFont('./fonts/sometimelater.otf', {
		family: 'Some Time Later',
	});
	// pick image and font colour
	({
		backgroundImageURL,
		fontColour,
		soundClip,
		randID,
	} = getRandData());
	// create the canvas
	const canvas = Canvas.createCanvas(640, 480);
	const ctx = canvas.getContext('2d');
	// calculate where the lines should split
	({
		lines,
	} = calculateLines(imageMessage, 72, 640, 480, 80));
	// draw the background
	const background = await Canvas.loadImage(backgroundImageURL);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	// render all the lines
	ctx.font = '72px "Some Time Later"';
	ctx.fillStyle = fontColour;
	ctx.textAlign = 'center';
	ctx.shadowOffsetX = -3;
	ctx.shadowOffsetY = 3;
	ctx.shadowColor = '#000000';
	renderLines(ctx, lines, 72);
	console.log('i am starting to make the image');
	const out = fs.createWriteStream('./cache/titlecard' + randID + '.png');
	const stream = canvas.createPNGStream();
	await stream.pipe(out);
	// after the image is finished and saved
	out.on('finish', () => makeVideo('./cache/titlecard' + randID + '.png', message, soundClip, randID));
	// out.on('finish', function() {
	// 	message.channel.send({
	// 		files: [{
	// 			attachment: './cache/titlecard' + randID + '.png',
	// 			name: 'SpongebobIntro.png',
	// 		}],
	// 	});
	// });
}

function getRandData() {
	// get random background image
	const backgroundImageURL = './images/spongebob/' + spongebobData.backgrounds[Math.round(Math.random() * (spongebobData.backgrounds.length - 1))];
	// get random font colour
	const fontColour = spongebobData.fontColour[Math.round(Math.random() * (spongebobData.fontColour.length - 1))];
	// get random sound
	const soundClip = './audio/spongebob/' + spongebobData.soundClip[Math.round(Math.random() * (spongebobData.soundClip.length - 1))];
	// get random ID
	const randID = Math.round(Math.random() * 1000);
	// output backgroundImageURL + fontColour + soundClip + id
	return {
		backgroundImageURL,
		fontColour,
		soundClip,
		randID,
	};
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
	return {
		lines,
	};
}

function renderLines(ctx, lines, fontSize) {
	const lineOffset = lines.length * (fontSize / 2);
	for (let i = 0, j = lines.length; i < j; ++i) {
		//  ok so this line is a doozy
		// it's baseHeight - offset, then add a lineHeight times position, then add 2/3rds font size to get it equal
		ctx.fillText(lines[i], 320, ((240 - lineOffset) + ((fontSize * i) + 5)) + (fontSize / 1.5));
	}
}

function makeVideo(imageData, message, soundClip, randID) {
	console.log('i am starting to make the video');
	ffmpeg(imageData)
		.size('640x480')
		.loop(1.5)
		.fps(30)
		.videoFilters('fade=in:0:7')
		.input(soundClip)
		.inputOptions('-r 24')
		// parameters are as such, size is 640x480, play for half a second at 30fps, fade in for 7 frames and add the soundclip
		.on('end', function() {
			console.log('file has been converted succesfully');
			ffmpeg('./videos/SpongebobIntro.mp4')
				.setFfprobePath(ffprobePath)
				.input('./cache/titlecard' + randID + '.mp4')
				// after that, we merge with the original video
				.on('end', function() {
					console.log('files have been merged succesfully');
					message.channel.stopTyping();
					message.channel.send({
						files: [{
							attachment: './cache/merged' + randID + '.mp4',
							name: 'SpongebobIntro.mp4',
						}],
					})
						.then(setTimeout(delayedCleanup, 5000, randID))
						.catch(console.error);
				})
				.on('error', function(err) {
					console.log('an error happened: ' + err.message);
					message.channel.stopTyping();
					message.channel.send('OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo!');
					delayedCleanup(randID);
					return;
				})
				.mergeToFile('./cache/merged' + randID + '.mp4');
		})
		.on('error', function(err) {
			console.log('Error: ' + err.message);
			message.channel.stopTyping();
			message.channel.send('OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo!');
			delayedCleanup(randID);
			return;
		})
		.format('mp4')
		.save('./cache/titlecard' + randID + '.mp4');
}

function delayedCleanup(randID) {
	try {
		if (fs.existsSync('./cache/titlecard' + randID + '.png')) {
			fs.unlink('./cache/titlecard' + randID + '.png', () => {
				console.log('./cache/titlecard' + randID + '.png was deleted');
			});
		}
	}
	catch (err) {
		console.error(err);
	}
	try {
		if (fs.existsSync('./cache/merged' + randID + '.mp4')) {
			fs.unlink('./cache/merged' + randID + '.mp4', () => {
				console.log('./cache/merged' + randID + '.mp4 was deleted');
			});
		}
	}
	catch (err) {
		console.error(err);
	}
	try {
		if (fs.existsSync('./cache/titlecard' + randID + '.mp4')) {
			fs.unlink('./cache/titlecard' + randID + '.mp4', () => {
				console.log('./cache/titlecard' + randID + '.mp4 was deleted');
			});
		}
	}
	catch (err) {
		console.error(err);
	}
}

module.exports.info = {
	name: '!spongebob',
	description: 'Generates a Spongebob version of text',
	summon: '!spongebob [with optional text if you want a custom one]',
};
module.exports.regexp = '^!spongebob';