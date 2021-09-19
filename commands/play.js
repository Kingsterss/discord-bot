require('dotenv').config();
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_TOKEN);
const ytdl = require('discord-ytdl-core');
module.exports = {
    name: 'play',
    commands: ['p', 'play'],
    args: ['track name/link', 'playlist'],
    description: 'Plays tracks from youtube',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('Please join a voice chat first');
        if (!args) return message.channel.send('Please enter a search term');
        let regLink = args.toString().match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/);
        let playlistRegLink = args.toString().match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
        let result, song;
        if (playlistRegLink) {
            try {
                const playlist = await youtube.getPlaylist(args.toString());
                const songsInPlaylist = await playlist.getVideos();
                message.channel.send(`Now adding songs from playlist: ${playlist.title}`);
                message.client.queueFilling = true;
                for (const song of Object.values(songsInPlaylist)) {
                    if(message.client.queueFilling === false) break;
                    await playerHandler('https://www.youtube.com/watch?v=' + song.id, true);
                }
                message.client.queueFilling = false;
                message.channel.send('Playlist has been added to the queue!');
            } catch (error) {
                return error + ' @ playlist';
            }
        } else {
            try {
                result = regLink ? await youtube.searchVideos(args) : await youtube.searchVideos(args.join(' '));
                playerHandler(result[0].url);
            } catch (error) {
                return error + ' @ song';
            }
        }
        async function playerHandler(songUrl, isPlaylist = false) {
            serverQueue = message.client.queue.get(message.guild.id);
            message.client.radioMode = false;
            let songInfo = await youtube.getVideo(songUrl).catch(err => console.log(err + ' @ songInfo'));
            if (!songInfo) return undefined;
            song = {
                title: songInfo.title,
                url: songInfo.url,
            };
            if (!serverQueue) {
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true,
                };
                queueConstructor.songs.push(song);
                await message.client.queue.set(message.guild.id, queueConstructor);
                try {
                    let connection = await voiceChannel.join()
                    message.guild.me.voice.setSelfDeaf(true);
                    queueConstructor.connection = connection;
                    await play(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    console.error(err);
                    message.client.queue.delete(message.guild.id);
                    return message.channel.send(`Unable to join the voice chat ${err}`);
                }
            } else {
                try {
                    serverQueue.songs.push(song);
                    if (isPlaylist) return;
                    message.channel.send(`The song has been added ${song.title}`);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        async function play(guild, song) {
            const serverQueue = message.client.queue.get(guild.id);
            if (!song) {
                serverQueue.vChannel.leave();
                return message.client.queue.delete(guild.id);
            }
            let stream = await ytdl(song.url, {
                filter: 'audioonly',
                opusEncoded: true,
                encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
            });
            const dispatcher = serverQueue.connection.play(stream, {
                type: 'opus'
            }).on('finish', () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            }).on('error', error => console.error('error @ dispatcher ' + error + ` |${song.url}|`));
            serverQueue.txtChannel.send(`Now playing - | ${serverQueue.songs[0].title} |`);
        }
    },
};
