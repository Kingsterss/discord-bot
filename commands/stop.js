module.exports = {
    name: 'stop',
    description: 'Stops the bot from playing songs',
    execute(message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send('You need to join the voice chat first!')
        if (message.client.queue.size === 0)
            return message.channel.send('Queue is empty!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
}