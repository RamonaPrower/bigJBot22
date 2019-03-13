// imports
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const date = require('date-and-time');
// exports
module.exports = {
    async execute(message) {
            const shortname = message.member.displayName.split(' ').join('').substring(0,8);
            const { dateFin } = formatDate();
            Canvas.registerFont('./fonts/trebucbd.ttf', { family: 'Trebuchet MS', weight: 'bold' });
            Canvas.registerFont('./fonts/Verdana.ttf', { family: 'Verdana'})
            const canvas = Canvas.createCanvas(242, 70)
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('./images/godiwishbackground.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            const { body: buffer } = await snekfetch.get(message.member.user.displayAvatarURL);
            const avatar = await Canvas.loadImage(buffer);
            ctx.drawImage(avatar, 8, 4, 50, 50);
            ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
            const nameLength = ctx.measureText(`${shortname}21`).width;
            console.log(nameLength);
            ctx.fillStyle = '#337287';
            ctx.fillText(`${shortname}21`, 86, 32);
            ctx.font = '11px "Verdana", sans-serif';
            ctx.fillStyle = '#778584';
            ctx.fillText(dateFin, 86+ 10 + nameLength, 32);
            const canvas2 = Canvas.createCanvas(canvas.width * 2, canvas.height * 2);
            const ctx2 = canvas2.getContext('2d');
            ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
            const attachment = new Discord.Attachment(canvas2.toBuffer(), 'godimme.png');
            message.channel.send(attachment);
            try {message.delete();}
			catch (error) {
				console.error(error);
			}
         }
}
function formatDate() {
    const now = new Date();
    const dateFin = date.format(now, 'MMM DD, YYYY');
	return { dateFin };
}
module.exports.info = {
    name: 'God i wish that were me',
    description: 'For when you want to get into the boots of BigJB21',
    summon: 'saying "god i wish that was/were me", also via !god'
}
module.exports.regexp = '(^!god|god i wish that (were|was) me)'
