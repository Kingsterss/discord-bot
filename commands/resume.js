module.exports = {
	name: 'resume',
	commands: ['resume', 'unpause'],
	args: [],
	description: 'Resumes the currently paused song',
	async execute(message, args, constants, serverQueue, Discord, prefix) {
		if (message.guild.musicData.isPlaying) return message.channel.send('Already playing.');
		await message.guild.musicData.songDispatcher.resume();
		message.guild.musicData.isPlaying = true;
		return message.channel.send('▶ Resumed the music for you!');
	}
};
