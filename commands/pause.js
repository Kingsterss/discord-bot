module.exports = {
	name: 'pause',
	commands: ['pause'],
	args: [],
	description: 'Pause the current song',
	async execute(message, args, constants, serverQueue, Discord, prefix) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	}
};
