module.exports = {
	name: 'resume',
	commands: ['resume', 'unpause'],
	args: [],
	description: 'Resumes the current paused song',
	async execute(message, args, constants, serverQueue, Discord, prefix) {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	}
};
