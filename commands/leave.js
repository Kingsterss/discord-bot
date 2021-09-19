module.exports = {
    name: 'leave',
    commands: ['leave', 'adios'],
    args: [],
    description: 'Stops the bot and leaves the voice channel',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to do this!');
        if (serverQueue)
            try {
                serverQueue.songs = [];
                await serverQueue.connection.dispatcher.end();
            } catch (error) {
                console.error('error @ leave.js', error)
            }
        await voiceChannel.leave();
        await message.channel.send('leaving channel');
    }
}
