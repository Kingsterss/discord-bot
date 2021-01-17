module.exports = {
    name: 'leave',
    description: 'Stops the bot and leaves the voice channel',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return message.channel.send('You need to be in a voice channel to do this!');
        await voiceChannel.leave();
        await message.channel.send('leaving channel');
    }
}