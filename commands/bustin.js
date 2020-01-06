// imports
const path = require('path');
// exports
module.exports = {
    async execute(message, bustinPlayer) {

            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send('Not in a voice channel');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('I need voice channel permissions (joining and speaking)');
            }

            if (bustinPlayer.active(voiceChannel)) {
                bustinPlayer.stop(voiceChannel);
                return;
            }
                // const connection = await voiceChannel.join();
                const absopath = path.resolve('./audio/bustin.mp3');
                bustinPlayer.start(absopath, voiceChannel);
                message.channel.send('<:bustin:663796431798140984>');
                // const dispatcher = connection.playFile(absopath);

         },
};
module.exports.info = {
    name: 'Bustin',
    description: 'Summon the power of neil to feel good',
    summon: '!bustin',
};
module.exports.regexp = /^!bustin/mi;