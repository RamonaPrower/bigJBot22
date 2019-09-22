// imports
const Canvas = require('canvas');
const Discord = require('discord.js');
const getAvatar = require('../utils/avatarCheck');
// exports
module.exports = {
    async execute(message) {
        message.channel.startTyping();
        const canvas = Canvas.createCanvas(255, 68);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./images/somad.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		const buffer = await getAvatar(message.member.user.displayAvatarURL);
		const avatar = await Canvas.loadImage(buffer);
		ctx.drawImage(avatar, 200, 9, 50, 50);
		const canvas2 = Canvas.createCanvas(510, 136);
		const ctx2 = canvas2.getContext('2d');
		ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
		const attachment = new Discord.Attachment(canvas2.toBuffer(), 'custommad.png');
        message.channel.send(attachment);
        message.channel.stopTyping();
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