const Canvas = require('canvas');
const fs = require('fs');
const spongebobData = require('../strings/spongebob.json');
const ffmpeg = require('fluent-ffmpeg');
/**
 * New Spongebob Image Generator
 */
class SpongebobImage {
	/**
	 * The Constructor for the image generation
	 * @param {string} user The String of the user to attribute
	 * @param {string} message The String of the message to construct
	 */
	constructor(user, message) {
		this.user = user;
		this.message = message;
		this.rand = Math.round(Math.random() * 1000);
		this.creditsCardUri = './cache/creditcard' + this.rand + '.png';
		this.creditsVideoUri = './cache/creditVideo' + this.rand + '.mp4';
		this.titlecardUri = './cache/titlecard' + this.rand + '.png';
		this.titleVideoUri = './cache/titlevideo' + this.rand + '.mp4';
		this.mergedVideoUri = './cache/merged' + this.rand + '.mp4';
		// this.imageType = 'dragonball';
		this.imageType = this.findType();
		this.backgroundImageURL = './images/spongebob/' + spongebobData.backgrounds[Math.round(Math.random() * (spongebobData.backgrounds.length - 1))];
		this.fontColour = spongebobData.fontColour[Math.round(Math.random() * (spongebobData.fontColour.length - 1))];
		this.soundClip = './audio/spongebob/' + spongebobData.soundClip[Math.round(Math.random() * (spongebobData.soundClip.length - 1))];
	}
	findType() {
		const rand = Math.floor((Math.random() * 100) + 1);
		if (rand < 2) {return 'dragonball';}
		else {return 'spongebob';}
	}
	/**
	 * Generate a credits image based on the input
	 */
	async generateCredits() {
		Canvas.registerFont('./fonts/sometimelater.otf', {
			family: 'Some Time Later',
		});
		const canvas = Canvas.createCanvas(640, 480);
		const ctx = canvas.getContext('2d');
		// remove this after dev is done
		const background = await Canvas.loadImage('./images/spongebob/spongebob.jpg');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.font = '50px "Some Time Later"';
		ctx.fillStyle = '#413263';
		ctx.textAlign = 'center';
		ctx.fillText('Created By', 320, 185);

		ctx.font = '72px "Some Time Later"';
		ctx.fillStyle = '#413263';
		ctx.textAlign = 'center';
		ctx.fillText(this.user, 320, 300, 520);

		return canvas;
	}
	async generateTitlecard(lines) {
		let canvreturn;
		if (this.imageType === 'dragonball') {
			canvreturn = await this.generateDragonballTitlecard(lines);
		}
		else {
			canvreturn = await this.generateSpongebobTitlecard(lines);
		}
		return canvreturn;
	}
	async generateSpongebobTitlecard(lines) {
		function renderLines(ctx, lines2, fontSize) {
			const lineOffset = lines2.length * (fontSize / 2);
			for (let i = 0, j = lines2.length; i < j; ++i) {
				//  ok so this line is a doozy
				// it's baseHeight - offset, then add a lineHeight times position, then add 2/3rds font size to get it equal
				ctx.fillText(lines2[i], 320, ((240 - lineOffset) + ((fontSize * i) + 5)) + (fontSize / 1.5));
			}
		}
		Canvas.registerFont('./fonts/sometimelater.otf', {
			family: 'Some Time Later',
		});
		const canvas = Canvas.createCanvas(640, 480);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage(this.backgroundImageURL);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		// render all the lines
		ctx.font = '60px "Some Time Later"';
		ctx.fillStyle = this.fontColour;
		ctx.textAlign = 'center';
		ctx.shadowOffsetX = -3;
		ctx.shadowOffsetY = 3;
		ctx.shadowColor = '#000000';
		renderLines(ctx, lines, 60);
		return canvas;
	}
	async generateDragonballTitlecard(lines) {
		function renderLines(ctx, lines2, fontSize) {
			const lineOffset = lines2.length * (fontSize / 2);
			for (let i = 0, j = lines2.length; i < j; ++i) {
				//  ok so this line is a doozy
				// it's baseHeight - offset, then add a lineHeight times position, then add 2/3rds font size to get it equal
				ctx.fillText(lines2[i], 320, ((240 - lineOffset) + ((fontSize * i) + 5)) + (fontSize / 1.5));
			}
		}
		Canvas.registerFont('./fonts/Finalnew.ttf', {
			family: 'Final Frontier',
		});
		const canvas = Canvas.createCanvas(640, 480);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage(this.backgroundImageURL);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		// render all the lines
		ctx.font = '60px "Final Frontier"';
		ctx.fillStyle = this.fontColour;
		ctx.textAlign = 'center';
		ctx.shadowOffsetX = -3;
		ctx.shadowOffsetY = 3;
		ctx.shadowColor = '#000000';
		renderLines(ctx, lines, 60);
		const balls = await Canvas.loadImage('./images/spongebob/dragonball.png');
		ctx.drawImage(balls, 0, 0, canvas.width, canvas.height);
		return canvas;
	}
	async generateTitleVideo() {
		if (this.imageType === 'dragonball') {
			await this.generateDragonballTitleVideo();
		}
		else {
			await this.generateSpongebobTitleVideo();
		}
		await this.generateSpongebobCreditVideo();
		await this.combineVideos();
		return this.mergedVideoUri;
		}
	generateSpongebobTitleVideo() {
		return new Promise((resolve, reject) => {
			ffmpeg()
			.input(this.titlecardUri)
			.size('640x480')
			.loop(1.5)
			.fps(30)
			.videoFilters('fade=in:0:7')
			.input(this.soundClip)
			.inputOptions('-r 24')
			.format('mp4')
			.on('end', resolve)
			.on('error', reject)
			.save(this.titleVideoUri);
		});
	}
	generateSpongebobCreditVideo() {
		return new Promise((resolve, reject) => {
			ffmpeg()
			.input(this.creditsCardUri)
			.size('640x480')
			.loop(2.3)
			.fps(30)
			.videoFilters('fade=out:46:5')
			.input('./audio/spongebob/spongebobcredit.ogg')
			.format('mp4')
			.on('end', resolve)
			.on('error', reject)
			.save(this.creditsVideoUri);
		});
	}
	generateDragonballTitleVideo() {
		return new Promise((resolve, reject) => {
			ffmpeg()
			.input(this.titlecardUri)
			.size('640x480')
			.loop(6)
			.fps(30)
			.videoFilters('fade=in:0:7')
			.input('./audio/spongebob/dragonball.mp3')
			.format('mp4')
			.on('end', resolve)
			.on('error', reject)
			.save(this.titleVideoUri);
		});
	}
	combineVideos() {
		return new Promise((resolve, reject) => {
			ffmpeg()
			.input('./videos/spongebobIntroNoCredit.mp4')
			.input(this.creditsVideoUri)
			.input(this.titleVideoUri)
			.format('mp4')
			.on('end', resolve)
			.on('error', reject)
			.mergeToFile(this.mergedVideoUri, '../cache/');
		});
	}
	cleanup() {
		try {
			if (fs.existsSync(this.creditsCardUri)) {
				fs.unlink(this.creditsCardUri, () => {
					console.log(`${this.creditsCardUri} was deleted`);
				});
			}
		}
		catch (err) {
			console.error(err);
		}
		try {
			if (fs.existsSync(this.creditsVideoUri)) {
				fs.unlink(this.creditsVideoUri, () => {
					console.log(`${this.creditsVideoUri} was deleted`);
				});
			}
		}
		catch (err) {
			console.error(err);
		}
		try {
			if (fs.existsSync(this.titlecardUri)) {
				fs.unlink(this.titlecardUri, () => {
					console.log(`${this.titlecardUri} was deleted`);
				});
			}
		}
		catch (err) {
			console.error(err);
		}
		try {
			if (fs.existsSync(this.titleVideoUri)) {
				fs.unlink(this.titleVideoUri, () => {
					console.log(`${this.titleVideoUri} was deleted`);
				});
			}
		}
		catch (err) {
			console.error(err);
		}
		try {
			if (fs.existsSync(this.mergedVideoUri)) {
				fs.unlink(this.mergedVideoUri, () => {
					console.log(`${this.mergedVideoUri} was deleted`);
				});
			}
		}
		catch (err) {
			console.error(err);
		}
	}
}

module.exports.SpongebobImage = SpongebobImage;