module.exports = {
    name: 'nick',
    commands: ['nick'],
    args: ['name'],
    description: 'Changes the bot\'s username',
    async execute(message, args, serverQueue, Discord, prefix) {
        if (!args[0]) return message.channel.send('Provide a username argument!');
        const nick = args[0] === 'reset'? null : args[0]
        return message.guild.members.cache.get(message.client.user.id).setNickname(nick).then(x => message.channel.send('Successfully changed username!'));
    }
}