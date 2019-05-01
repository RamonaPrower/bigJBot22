// imports
const Canvas = require('canvas');
const Discord = require('discord.js');
// exports
module.exports = {
    async execute(message) {
        const subject = messageHandler(message);
        const canvas = Canvas.createCanvas(334, 144);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./images/location.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '15px Arial';
        ctx.fillText(subject, 24, 38, 253);
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'location.png');
        console.log(subject);
        message.channel.send(attachment);
        try {
            message.delete();
        } catch (error) {
            console.error(error);
        }
    }
}

function messageHandler(message) {
    let subject = message.cleanContent;
    subject = subject.replace(/(!location\s+|\s+(wants to|would like to) know your location$)/gmi, "")
    subject = subject.replace(/^@/gmi, "")
    subject = subject.substring(0, 30);
    subject += " wants to:";
    return subject;
};

module.exports.info = {
    name: '!location',
    description: 'for when something or someone wants to know your location',
    summon: '!location [INPUT] or [INPUT] wants to/would like to know your location'
}
module.exports.regexp = '(!location .+|.+ (wants to|would like to) know your location$)'