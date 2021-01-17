const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');

const searcher = new YTSearcher({
    key: 'AIzaSyCT7SvTzyZX23d6mewlqNbQ3AIM_3b10uk',
    revealed: true
});

module.exports = {
    name: 'play',
    description: 'Plays a song from youtube',
    async execute(message, serverQueue, args) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('Please join a voice chat first');
        }
        else {
            let regLink = args.toString().match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/);
            let result;

            if (!regLink || args.toString().substring(0, 4) !== 'http')
                result = await searcher.search(args.join(' '), { type: 'video' });
            else
                result = await searcher.search(args, { type: 'video' });

            let songInfo = await ytdl.getInfo(result.first.url);

            let song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };

            if (!serverQueue) {
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true
                };
                message.client.queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);

                try {
                    let connection = await voiceChannel.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    console.error(err);
                    message.client.queue.delete(message.guild.id);
                    return message.channel.send(`Unable to join the voice chat ${err}`)
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`The song has been added ${song.url}`);
            }

            function play(guild, song) {
                const serverQueue = message.client.queue.get(guild.id);
                if (!song) {
                    serverQueue.vChannel.leave();
                    message.client.queue.delete(guild.id);
                    return;
                }
                const dispatcher = serverQueue.connection
                    .play(ytdl(song.url))
                    .on('finish', () => {
                        serverQueue.songs.shift();
                        play(guild, serverQueue.songs[0]);
                    })
                serverQueue.txtChannel.send(`Now playing ${serverQueue.songs[0].url}`)
            }
        }
    }
}