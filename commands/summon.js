module.exports = {
    name: 'summon',
    commands: ['summon', 'sum'],
    args: [''],
    description: 'Adds the bot to the invoker\'s voice channel',
    async execute(message, args, serverQueue, Discord, prefix) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('Please join a voice chat first');
        message.channel.send('Whomst has summoned the ancient one');
        return voiceChannel.join();
    }
}