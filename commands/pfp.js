module.exports = {
    name: 'pfp',
    commands: ['pfp'],
    args: ['image link', 'copy'],
    description: 'Changes the bot\'s profile picture',
    async execute(message, args, serverQueue, Discord, prefix) {
        if (message.author.id !== message.client.owner) return message.channel.send('You can\'t use this command!');
        if (!args[0]) return message.channel.send('Provide a link');
        const user = message.mentions.users.first() || message.author;
        const pic = args[0] !== 'copy' ? !message.mentions.users.size ? args[0] : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
        console.log(pic.trim())
        return message.channel.send(await message.client.setPfp(pic.trim()));
    }
}
