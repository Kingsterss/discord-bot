module.exports = {
    name: 'queue',
    commands: ['q', 'queue'],
    args: [],
    description: 'Displays the queue',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const songsCountToShow = 20;
        const limitedSongsCounter = '\t and {LIMITEDSONGS} more...';
        if (!serverQueue)
            return message.channel.send('There is nothing playing.');
        return message.channel.send(`
        📻🎶 Song queue:
${serverQueue.songs.map(song => `🎵 **-** ${song.title}`).slice(0, songsCountToShow).join('\n')} \n ${serverQueue.songs.length - 20 <= 0 ? '' : limitedSongsCounter.replace('{LIMITEDSONGS}', serverQueue.songs.length - 20)}
        🔊 Now playing: ${serverQueue.songs[0].title}`);
    }
}
