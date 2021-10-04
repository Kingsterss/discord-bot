require('dotenv').config();
const YouTube = require('simple-youtube-api');
const ytdl = require('discord-ytdl-core');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'play',
    commands: ['p', 'play'],
    args: ['track name/link', 'playlist'],
    description: 'Plays tracks from youtube',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('Please join a voice chat first');
        const youtube = new YouTube(constants.youtubeLinks[message.client.youtubeKey()]);
        let query = args.toString();
        if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
            try {
                const playlist = await youtube.getPlaylist(query);
                const videosObj = await playlist.getVideos();
                for (let i = 0; i < videosObj.length; i++) {
                    const video = await videosObj[i].fetch();

                    const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                    const title = video.raw.snippet.title;
                    let duration = this.formatDuration(video.duration);
                    const thumbnail = video.thumbnails.high.url;
                    if (duration == '00:00') duration = 'Live Stream';
                    const song = {
                        url,
                        title,
                        duration,
                        thumbnail,
                        voiceChannel
                    };

                    message.guild.musicData.queue.push(song);

                }
                if (message.guild.musicData.isPlaying == false) {
                    message.guild.musicData.isPlaying = true;
                    return this.playSong(message.guild.musicData.queue, message);
                } else if (message.guild.musicData.isPlaying == true) {
                    return message.channel.send(
                        `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
                    );
                }
            } catch (err) {
                console.error(err);
                return message.channel.send('Playlist is either private or it does not exist');
            }
        }
        if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
            const url = query;
            try {
                query = query
                    .replace(/(>|<)/gi, '')
                    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                const id = query[2].split(/[^0-9a-z_\-]/i)[0];
                const video = await youtube.getVideoByID(id);
                const title = video.title;
                let duration = this.formatDuration(video.duration);
                const thumbnail = video.thumbnails.high.url;
                if (duration == '00:00') duration = 'Live Stream';
                const song = {
                    url,
                    title,
                    duration,
                    thumbnail,
                    voiceChannel
                };
                message.guild.musicData.queue.push(song);
                if (
                    message.guild.musicData.isPlaying == false ||
                    typeof message.guild.musicData.isPlaying == 'undefined'
                ) {
                    message.guild.musicData.isPlaying = true;
                    return this.playSong(message.guild.musicData.queue, message);
                } else if (message.guild.musicData.isPlaying == true) {
                    return message.channel.send(`${song.title} added to queue`);
                }
            } catch (err) {
                console.error(err);
                return message.channel.send('Something went wrong, please try again later');
            }
        }
        try {
            const videos = await youtube.searchVideos(query, 5);
            if (videos.length < 5) {
                return message.channel.send(`I had some trouble finding what you were looking for, please try again or be more specific`);
            }
            const vidNameArr = [];
            for (let i = 0; i < videos.length; i++) {
                vidNameArr.push(`${i + 1}: ${videos[i].title}`);
            }
            vidNameArr.push('exit');
            const embed = new MessageEmbed()
                .setColor('#e9f931')
                .setTitle('Choose a song by commenting a number between 1 and 5')
                .addField('Song 1', vidNameArr[0])
                .addField('Song 2', vidNameArr[1])
                .addField('Song 3', vidNameArr[2])
                .addField('Song 4', vidNameArr[3])
                .addField('Song 5', vidNameArr[4])
                .addField('Exit', 'exit');
            var songEmbed = await message.channel.send({ embed });
            try {
                var response = await message.channel.awaitMessages(
                    msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit',
                    {
                        max: 1,
                        maxProcessed: 1,
                        time: 60000,
                        errors: ['time']
                    }
                );
                var videoIndex = parseInt(response.first().content);
            } catch (err) {
                console.error(err);
                songEmbed.delete();
                return message.channel.send(
                    'Please try again and enter a number between 1 and 5 or exit'
                );
            }
            if (response.first().content === 'exit') return songEmbed.delete();
            try {
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                songEmbed.delete();
                return message.channel.send(
                    'An error has occured when trying to get the video ID from youtube'
                );
            }
            const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
            const title = video.title;
            let duration = this.formatDuration(video.duration);
            const thumbnail = video.thumbnails.high.url;
            if (duration == '00:00') duration = 'Live Stream';
            const song = {
                url,
                title,
                duration,
                thumbnail,
                voiceChannel
            };

            message.guild.musicData.queue.push(song);

            if (message.guild.musicData.isPlaying == false) {
                message.guild.musicData.isPlaying = true;
                songEmbed.delete(); // delete the selection embed
                this.playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying == true) {
                songEmbed.delete();
                return message.channel.send(`${song.title} added to queue`);
            }
        } catch (err) {
            console.error(err);
            if (songEmbed) {
                songEmbed.delete();
            }
            return message.channel.send(
                'Something went wrong with searching the video you requested :('
            );
        }
    },
    playSong(queue, message) {
        let voiceChannel;
        console.log(queue[0].url);
        queue[0].voiceChannel
            .join()
            .then(async connection => {
                voiceChannel = queue[0].voiceChannel;
                const stream = await ytdl(queue[0].url, {
                    filter: 'audioonly',
                    quality: 'highestaudio',
                    opusEncoded: true,
                    highWaterMark: 1024 * 1024 * 10,
                    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=420']
                });
                const dispatcher = connection
                    .play(stream, { type: 'opus' })
                        .on('start', () => {
                            message.guild.musicData.songDispatcher = dispatcher;
                            dispatcher.setVolume(message.guild.musicData.volume);
                            const videoEmbed = new MessageEmbed()
                                .setThumbnail(queue[0].thumbnail)
                                .setColor('#e9f931')
                                .addField('Now Playing:', queue[0].title)
                                .addField('Duration:', queue[0].duration);
                            if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);
                            message.channel.send(videoEmbed);
                            return queue.shift();
                        })
                        .on('finish', () => {
                            if (queue.length >= 1) {
                                return this.playSong(queue, message);
                            } else {
                                message.guild.musicData.isPlaying = false;
                                return voiceChannel.leave();
                            }
                        })
                        .on('error', e => {
                            message.channel.send('Cannot play song');
                            message.guild.musicData.queue.length = 0;
                            message.guild.musicData.isPlaying = false;
                            message.guild.musicData.nowPlaying = null;
                            console.error(e);
                            return voiceChannel.leave();
                        })
            })
            .catch(e => {
                console.error(e);
                return voiceChannel.leave();
            });
    },
    formatDuration(durationObj) {
        const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${durationObj.minutes ? durationObj.minutes : '00'
            }:${durationObj.seconds < 10
                ? '0' + durationObj.seconds
                : durationObj.seconds
                    ? durationObj.seconds
                    : '00'
            }`;
        return duration;
    }
}

    // if (!args) return message.channel.send('Please enter a search term');
    // const playlistRegLink = args.toString().match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/);
    // const regLink = args.toString().match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/);
    // let result, song;
    // const youtube = new YouTube(constants.youtubeLinks[message.client.youtubeKey()]);
    // if (playlistRegLink) {
    //     return console.log('how.');
    //     try {
    //         const playlist = await youtube.getPlaylist(args.toString());
    //         const songsInPlaylist = await playlist.getVideos();
    //         message.channel.send(`Now adding songs from playlist: ${playlist.title}`);
    //         message.client.queueFilling = true;
    //         for (const song of Object.values(songsInPlaylist)) {
    //             if (message.client.queueFilling === false) break;
    //             await playerHandler('https://www.youtube.com/watch?v=' + song.id, true);
    //         }
    //         message.client.queueFilling = false;
    //         message.channel.send('Playlist has been added to the queue!');
    //     } catch (error) {
    //         return error + ' @ playlist';
    //     }
    // } else {
    //     try {
    //         result = regLink ? await youtube.getVideoByID(args) : await youtube.searchVideos(args.join(' '));
    //         playerHandler(result[0].url);
    //     } catch (error) {
    //         return error + ' @ song';
    //     }
    // }
    // async function playerHandler(songUrl, isPlaylist = false) {
    //     serverQueue = message.client.queue.get(message.guild.id);
    //     message.client.radioMode = false;
    //     let songInfo = await youtube.getVideo(songUrl).catch(err => console.log(err + ' @ songInfo'));
    //     if (!songInfo) return undefined;
    //     song = {
    //         title: songInfo.title,
    //         url: songInfo.url,
    //     };
    //     if (!serverQueue) {
    //         const queueConstructor = {
    //             txtChannel: message.channel,
    //             vChannel: voiceChannel,
    //             connection: null,
    //             songs: [],
    //             volume: 10,
    //             playing: true,
    //         };
    //         queueConstructor.songs.push(song);
    //         await message.client.queue.set(message.guild.id, queueConstructor);
    //         try {
    //             let connection = await voiceChannel.join()
    //             message.guild.me.voice.setSelfDeaf(true);
    //             queueConstructor.connection = connection;
    //             await play(message.guild, queueConstructor.songs[0]);
    //         } catch (err) {
    //             console.error(err);
    //             message.client.queue.delete(message.guild.id);
    //             return message.channel.send(`Unable to join the voice chat ${err}`);
    //         }
    //     } else {
    //         try {
    //             serverQueue.songs.push(song);
    //             if (isPlaylist) return;
    //             message.channel.send(`The song has been added | ${song.title} |`);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }
    // async function play(guild, song) {
    //     const serverQueue = message.client.queue.get(guild.id);
    //     if (!song) {
    //         serverQueue.vChannel.leave();
    //         return message.client.queue.delete(guild.id);
    //     }
    //     let stream = await ytdl(song.url, {
    //         filter: 'audioonly',
    //         quality: 'highest',
    //         opusEncoded: true,
    //         encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=420']
    //     });
    //     const dispatcher = serverQueue.connection.play(stream, { type: 'opus' })
    //         .on('finish', () => {
    //             serverQueue.songs.shift();
    //             play(guild, serverQueue.songs[0]);
    //         }).on('error', error => console.error('error @ dispatcher ' + error + ` | ${song.url} |`));
    //     serverQueue.txtChannel.send(`Now playing - | ${serverQueue.songs[0].title} |`);
    // }