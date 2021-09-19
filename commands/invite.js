module.exports = {
    name: 'invite link',
    commands: ['inv', 'invite'],
    args: [],
    description: 'Sends invite link',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        message.channel.send('If you wana invite me to your server use the invite link:');
        message.channel.send('https://discord.com/api/oauth2/authorize?client_id=794972667262140426&permissions=36703232&scope=bot');
    }
}
