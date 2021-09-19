module.exports = {
    name: 'stop',
    commands: ['stop'],
    args: [],
    description: 'Stops the bot from playing songs',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if(message.client.radioMode) message.guild.voice.channel.leave();
        message.client.radioMode = false;
        if (!message.member.voice.channel) return message.channel.send('You need to join the voice chat first!');
        if (message.client.queue.size === 0) return message.channel.send('Queue is empty!');
        if (serverQueue)
            try {
                serverQueue.songs = [];
                await serverQueue.connection.dispatcher.end();
            } catch (error) { console.error(error); }
    }
}
