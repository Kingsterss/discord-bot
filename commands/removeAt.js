module.exports = {
    name: 'removeAt',
    commands: ['removeAt'],
    args: ['place in queue'],
    description: 'Removes a track by it\'s position',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if (!message.member.voice.channel)
            return message.channel.send('You need to join the voice chat first');
        if (!serverQueue)
            return message.channel.send('There is nothing to skip!');
        serverQueue.connection.dispatcher.end();
    }
}
