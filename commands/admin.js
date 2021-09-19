const { Permissions } = require('discord.js');
module.exports = {
    name: 'admin',
    commands: ['admin'],
    args: ['status'],
    description: 'Changes the server\`s unique settings',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send('You can\'t use this command!');
        if (args[0] === 'status')
            console.log('status: ' + message.client.guildData(message.guild.id));
    }
}
