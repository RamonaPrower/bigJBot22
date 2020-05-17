// imports
const Discord = require('discord.js');
const imageGeneration = require('../utils/imageGeneration');
// exports
module.exports = {
    async execute(message) {
        const subject = messageHandler(message);
        const imageBuffer = await imageGeneration.locationImage(subject);
        const attachment = new Discord.MessageAttachment(imageBuffer, 'location.png');
        message.channel.send(attachment);
    },
};

function messageHandler(message) {
    let subject = message.cleanContent;
    subject = subject.replace(/(!location\s+|\s+(wants to|would like to) know your location$)/gmi, '');
    subject = subject.replace(/^@/gmi, '');
    subject = subject.substring(0, 32);
    subject += ' wants to:';
    return subject;
}

module.exports.info = {
    name: '!location',
    description: 'for when something or someone wants to know your location',
    summon: '!location [INPUT] or [INPUT] wants to/would like to know your location',
};
module.exports.regexp = /(!location .+|.+ (wants to|would like to) know your location$)/mi;