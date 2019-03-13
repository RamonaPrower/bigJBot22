const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client;
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.regexp, command);
}

client.on('ready', () => {
    console.log('ready');
});

client.on('message', message => {
	for (const key of client.commands) {
		let newReg = new RegExp(key[0], 'gmi');
		if (newReg.test(message)) {
			console.log('found ' + key[1].info.name);
			key[1].execute(message);
			break;
		};
	};
});

client.login(config.token)
	.then(console.log)
	.catch(console.error);