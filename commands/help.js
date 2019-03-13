// imports
const fs = require('fs');
const Discord = require('discord.js');

// exports
module.exports = {
    execute(message) {
        const data = [];
        const {
            commands
        } = message.client;
        const blankReg = new RegExp('^!bighelp$', 'gmi');
        if (blankReg.test(message.content)) {
            console.log('no added input');
            data.push('i can do all these things!!');
            data.push(commands.map(command => command.info.name).join(', '));
            data.push('you can also send !help [command name] to get info on a command');
            return message.channel.send(data, {
                split: true
            });
        } else {
            const splitMessage = message.content.split(' ');
            splitMessage.shift();
            var shiftedMessage = splitMessage.join(' ');
            for (const key of commands) {
                let newReg = new RegExp(key[0], 'gmi')
                if (newReg.test(shiftedMessage)) {
                    data.push(`Name: ${key[1].info.name}`);
                    data.push(`Description: ${key[1].info.description}`);
                    data.push(`Summon via: ${key[1].info.summon}`)
                    message.channel.send(data, {
                        split: true
                    });
                    break;
                }
            }
            if (data.length == 0) {
                const data = [];
                data.push(`hmmm...i can\'t seem to find ${shiftedMessage}. Strange.`)
                return message.channel.send(data, {
                    split: true
                });
            }
        }
    }
}

module.exports.info = {
    name: '!bighelp',
    description: 'Gives Further Info about a command',
    summon: 'uhhhhhhhh'
}
module.exports.regexp = '^!bighelp($| )'