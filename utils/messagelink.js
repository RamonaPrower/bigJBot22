module.exports = {
    isValidLink(link) {
        const linkRegexp = /^https:\/\/discordapp.com\/channels\/\d+\/\d+\/\d+$/mi;
        const result = linkRegexp.test(link);
        return result;
    },
    async getLinkObject(message, client) {
        const splitStr = message.match(/\d+/gmi);
        const obj = {};
        const foundGuild = client.guilds.get(splitStr[0]);
        if (!foundGuild) {
            obj.found = false;
            obj.reason = 'Couldn\'t find the server this message was in';
            return obj;
        }
        obj.guild = foundGuild;
        const foundChannel = obj.guild.channels.get(splitStr[1]);
        if (!foundChannel) {
            obj.found = false;
            obj.reason = 'Couldn\'t find the Channel this message was in';
            return obj;
        }
        obj.channel = foundChannel;
        let foundMessage;
        try {
            foundMessage = await obj.channel.fetchMessage(splitStr[2]);
        }
        catch (error) {
            obj.found = false;
            obj.reason = 'Couldn\'t find the message';
            return obj;
        }
        obj.found = true;
        obj.message = foundMessage;
        return obj;
    },
};