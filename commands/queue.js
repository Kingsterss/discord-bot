module.exports = {
    name: 'queue',
    description: 'Displays the queue',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) 
            return message.channel.send('There is nothing playing.');
        return message.channel.send(`
        📻🎶 Song queue:
${serverQueue.songs.map(song => `🎵 **-** ${song.title}`).join('\n')}
        🔊 Now playing: ${serverQueue.songs[0].title}`);
    }
}