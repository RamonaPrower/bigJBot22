// imports
const path = require('path');
// exports
module.exports = {
    async execute(message, bustinPlayer) {

            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send('<:bustin:663796431798140984>');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('I need voice channel permissions (joining and speaking)');
            }

            if (bustinPlayer.active(voiceChannel)) {
                bustinPlayer.stop(voiceChannel);
                return;
            }
            let absopath;
            const rand = Math.floor((Math.random() * 100) + 1);
            if (rand < 2) {absopath = path.resolve('./audio/bustinvania.mp3');}
            else {absopath = path.resolve('./audio/bustin.mp3');}
                bustinPlayer.start(absopath, voiceChannel);
            if (rand < 2) {
                message.channel.send('<:bustinvania:664131091040305152>');
                return;

            }
            else {
                message.channel.send('<:bustin:663796431798140984>');
                return;
            }


         },
};
module.exports.info = {
    name: 'Bustin',
    description: 'Summon the power of neil to feel good',
    summon: '!bustin',
};
module.exports.regexp = /^!bustin/mi;