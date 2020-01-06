class BustinPlayer {
    constructor() {
        this.activeChannels = new Map;
    }
    /**
     * This starts the bustin music in a channel (check it's not active beforehand)
     * @param {string} file the ABSOLUTE path of the file to play
     * @param {object} voiceChannel the voicechannel connection
     */
    async start(file, voiceChannel) {
                const guildId = voiceChannel.guild.id;
                const connection = await voiceChannel.join();
                const dispatcher = connection.playFile(file);
                this.activeChannels.set(guildId, dispatcher);
                dispatcher.on('end', () => {
                    connection.disconnect();
                    this.activeChannels.delete(guildId);
                });
    }
    active(voiceChannel) {
        const guildId = voiceChannel.guild.id;
        if (this.activeChannels.has(guildId)) return true;
        else return false;
    }
    stop(voiceChannel) {
        const guildId = voiceChannel.guild.id;
        const dispatcher = this.activeChannels.get(guildId);
        this.activeChannels.delete(guildId);
        dispatcher.end();
    }
}

module.exports.BustinPlayer = BustinPlayer;