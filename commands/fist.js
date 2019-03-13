// imports

// exports
module.exports = {
    execute(message) {
        const dice = Math.floor((Math.random() * 100) + 1);
		if (dice > 84 && !message.author.bot) {
			console.log('yiffed');
			message.channel.send('Yiff! ✊');
			return;
		}
		else {
			return;
		}
         }
}
module.exports.info = {
    name: 'Yiff!',
    description: 'Occasionally Yiffs at you',
    summon: 'Responds to people saying "Yiff" a bunch'
}
module.exports.regexp = '^yiff(.{1,3})?'