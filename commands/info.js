module.exports = {
    name: 'info',
    description: 'Prints the bot commands as embed message',
    execute(message, args, Discord, prefix) {

        const embedInfo = new Discord.MessageEmbed()
            .setColor('#00FBFF')
            .setTitle(':information_source: Info :information_source:')
            .setDescription(":wave: Hello, here you can see information about me.")
            .addFields(
                {
                    name: ':notes: Commands for playing music',
                    value: `
            >   ${prefix}play/p {song name} - Plays a song from youtube
            >   ${prefix}pause - Pause the current song
            >   ${prefix}resume - Resumes the current paused song
            >   ${prefix}queue - Displays the queue
            >   ${prefix}stop - Stops the bot from playing songs
            >   ${prefix}skip - Skips the current track
            `
                },

                { name: ":broom: Command for clearing messages that I've sent or have my prefix", value: `>   ${prefix}clean` },
                { name: ":earth_americas: Command for checking the minecraft server's status", value: `>   ${prefix}mc/mcinfo/minecraft` },
                { name: ':pancakes: Pancakes', value: '>   I like Pancackes' }
            )
            .setImage('https://bn1301files.storage.live.com/y4mz_XdND6b9cqoLM_D8Y5JgqqUb_0t2LITpja7AGRnV2EKzCjP9X8P7F6_bpfmHtmLEnzvpT75WccL86rqFPLv6yOQEAam3enEcMBMd7FNCZdTPt8A5YzTEcmN7jPDY642dJZr1wwM5lJ9Pa8x9LvuOUHih1Gt8V97KVe-3_-Df_6VdBoikSkoWuCnT0jJwP7v?width=681&height=676&cropmode=none')
            .setFooter('Remember. Keep it simple!')

        message.channel.send(embedInfo)
    }
}