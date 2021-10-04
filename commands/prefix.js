const { Permissions } = require('discord.js');

module.exports = {
    name: 'prefix',
    commands: ['prefix', 'prfx'],
    args: ['change', 'reset'],
    description: 'Changes the prefix for the current server or resets it to default',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send('You can\'t use this command!');
        if (!args[0]) return message.channel.send('Please provide an option!');
        if(!args[1]) return message.channel.send('Please provide a prefix!');
        try {
            if (args[0] === 'change')
                message.client.prefixGuildData(message.guild.id, args[1]);
            if (args[0] === 'reset')
                message.client.prefixGuildData(message.guild.id, constants.env.defaultPrefix);
            return message.channel.send('Prefix changes saved');
        } catch (error) {
            return message.channel.send('Prefix changes not saved! Error message: ' + error);
        }
    }
}
