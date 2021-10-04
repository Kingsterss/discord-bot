module.exports = {
	name: 'pause',
	commands: ['pause'],
	args: [],
	description: 'Pause the current song',
	async execute(message, args, constants, serverQueue, Discord, prefix) {
		if (!message.guild.musicData.isPlaying) return message.channel.send('Nothing playing.');
		await message.guild.musicData.songDispatcher.pause();
		message.guild.musicData.isPlaying = false;
		return message.channel.send('⏸ Paused the music for you!');
	}
};
