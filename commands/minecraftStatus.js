const { Message } = require('discord.js');
const minecraftServer = require('minecraft-server-util');

module.exports = {
    name: 'minecraftStatus',
    description: 'Displays the status of minecraft server',
    execute(message, Discord) {
        minecraftServer.status('25.62.71.81')
            .then((response) => {
                const embed = new Discord.MessageEmbed()
                    .setColor('#43EB34')
                    .setTitle('Minecraft Server is currently online!')
                    .setDescription('Server information:')
                    .addFields(
                        { name: 'Server IP', value: response.host },
                        { name: 'Server Version', value: response.version },
                        { name: 'Online Players', value: response.onlinePlayers },
                        { name: 'Max Players', value: response.maxPlayers },
                        { name: "To join the server you'll need to:", value: '> Have Hamachi downloaded on your machine'},
                        { name: 'Network name:', value: '> Minecraft piqnici'},
                        { name: 'Network pass:', value: '> nz123'})
                    .setFooter('Remember. Keep the creepers far from the house!')

                message.channel.send(embed);
            })
            .catch((error) => {
                message.channel.send("Can't get anything right now. The server isn't currently online.")
            })
    }
}