module.exports = {
    name: 'leave',
    commands: ['leave', 'adios', 'stop'],
    args: [],
    description: 'Stops the bot and leaves the voice channel',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to do this!');
        if (!message.guild.musicData.isPlaying) return message.channel.send('Nothing playing');
        message.guild.musicData.queue.length = 0;
        message.guild.musicData.isPlaying = false;
        message.guild.musicData.nowPlaying = null;
        voiceChannel.leave();
        return message.channel.send('Leaving channel!');
    }
}