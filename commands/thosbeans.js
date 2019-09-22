// imports
const Canvas = require('canvas');
const getAvatar = require('../utils/avatarCheck');
const Discord = require('discord.js');

// exports
module.exports = {
    async execute(message) {
        Canvas.registerFont('./fonts/HelveticaBold.ttf', { family: 'Helvetica', weight: 'bold' });
        const shortname = message.member.displayName.substring(0, 20);
        const canvas = Canvas.createCanvas(384, 144);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./images/beans.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 10px "Helvetica"';
        const nameLength = ctx.measureText(shortname).width;
        ctx.fillStyle = '#45619d';
        ctx.fillText(`${shortname}`, 50, 26);
        const buffer = await getAvatar(message.member.user.displayAvatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 14, 15, 30, 30);
        const beansEnd = await Canvas.loadImage('./images/beanstag.png');
        ctx.drawImage(beansEnd, 50 + nameLength + 5, 18, 79, 9);
        const canvas2 = Canvas.createCanvas(768, 288);
        const ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        const attachment = new Discord.Attachment(canvas2.toBuffer(), 'thosbeans.png');
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
    name: 'thinkin about thos beans',
    description: 'For when the beans are being thought about',
    summon: '!thosbeans or "thinkin about thos beans"',
};
module.exports.regexp = /^(!thosbeans|thinkin about thos beans)/mi;