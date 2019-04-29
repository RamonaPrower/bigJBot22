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
	console.log(`I'm up, and i'm part of ${client.guilds.size} servers`);
});

client.on('message', message => {
	if (message.author.bot) return;
	for (const key of client.commands) {
		const newReg = new RegExp(key[0], 'gmi');
		if (newReg.test(message.content)) {
			console.log('found ' + key[1].info.name);
			key[1].execute(message);
			break;
		};
	};
});

client.on('error', data => {
	console.error('Connection Error', data.message);
	autoRestartServer();
})

client.on('disconnect', data => {
	console.error('I have Disconnected', data.message);
	autoRestartServer();
})

client.login(config.token)
	.then(console.log(`Logged In`))
	.catch(console.error);

function autoRestartServer() {
	setTimeout(() => {
		if (!client.status == 0) process.exit(1);
	}, 1500)
}