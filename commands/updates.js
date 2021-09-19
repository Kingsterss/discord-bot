module.exports = {
    name: 'update',
    commands: ['update'],
    args: [],
    description: 'add description',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const embed = new Discord.MessageEmbed()
            .setDescription('For info about the upcoming and undergoing update check the [Trello board](https://trello.com/b/N7LJzeZK/kisbot)<- click here.')
        message.channel.send(embed);
    }
}
