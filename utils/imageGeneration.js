const Canvas = require('canvas');
const getAvatar = require('../utils/avatarCheck');
const date = require('date-and-time');

module.exports = {
    /**
     * "God i wish that were me" Image Generation
     * @param {String} avatarURL the url of the users avatar
     * @param {String} shortname the shortened username to print
     * @returns {Buffer} returns canvas image buffer
     */
    async thatWereMeImage(avatarURL, shortname) {
        const now = new Date();
        const dateFin = date.format(now, 'MMM DD, YYYY');
        Canvas.registerFont('./fonts/trebucbd.ttf', { family: 'Trebuchet MS', weight: 'bold' });
        Canvas.registerFont('./fonts/Verdana.ttf', { family: 'Verdana' });
        const canvas = Canvas.createCanvas(242, 70);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./images/godiwishbackground.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const buffer = await getAvatar(avatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 8, 4, 50, 50);
        ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
        const nameLength = ctx.measureText(`${shortname}21`).width;
        ctx.fillStyle = '#337287';
        ctx.fillText(`${shortname}21`, 86, 32);
        ctx.font = '11px "Verdana", sans-serif';
        ctx.fillStyle = '#778584';
        ctx.fillText(dateFin, 86 + 10 + nameLength, 32);
        const canvas2 = Canvas.createCanvas(canvas.width * 2, canvas.height * 2);
        const ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        return canvas2.toBuffer();
    },
    /**
     * "Un-Follow Me Now" meme image generation
     * @param {String} avatarURL URL of the avatar to use
     * @param {Array} names Array of two names to use
     * @returns {Buffer} Returns canvas image buffer
     */
    async unfollowMeImage(avatarURL, names) {
        const now = new Date();
        const timeRaw = date.format(now, 'h:mm A');
        const timeBig = timeRaw.toUpperCase();
        const dateTimeFin = `${timeBig} - ${date.format(now, 'D MMM YYYY')}`;
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
        const buffer = await getAvatar(avatarURL);
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
        return canvas.toBuffer();
    },
    /**
     * "Thinkin about thos beans" meme image
     * @param {String} avatarURL the URL of the avatar to print
     * @param {String} shortname The shortened name to print
     * @returns {Buffer} Returns canvas image buffer
     */
    async thosBeansImage(avatarURL, shortname) {
        Canvas.registerFont('./fonts/HelveticaBold.ttf', { family: 'Helvetica', weight: 'bold' });
        const canvas = Canvas.createCanvas(384, 144);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./images/beans.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 10px "Helvetica"';
        const nameLength = ctx.measureText(shortname).width;
        ctx.fillStyle = '#45619d';
        ctx.fillText(`${shortname}`, 50, 26);
        const buffer = await getAvatar(avatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 14, 15, 30, 30);
        const beansEnd = await Canvas.loadImage('./images/beanstag.png');
        ctx.drawImage(beansEnd, 50 + nameLength + 5, 18, 79, 9);
        const canvas2 = Canvas.createCanvas(768, 288);
        const ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        return canvas2.toBuffer();
    },
    /**
     * "Hint: I am so fucking mad" meme image
     * @param {String} avatarURL The URL of the avatar to print
     * @returns {Buffer} Returns canvas image buffer
     */
    async soMadImage(avatarURL) {
        const canvas = Canvas.createCanvas(255, 68);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./images/somad.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		const avatar = await Canvas.loadImage(avatarURL);
		ctx.drawImage(avatar, 200, 9, 50, 50);
		const canvas2 = Canvas.createCanvas(510, 136);
		const ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        return canvas2.toBuffer();
    },
    async locationImage(subject) {
        const canvas = Canvas.createCanvas(334, 144);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./images/location.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '15px Arial';
        ctx.fillText(subject, 24, 38, 253);
        return canvas.toBuffer();
    },
};