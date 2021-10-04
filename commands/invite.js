module.exports = {
    name: 'invite link',
    commands: ['inv', 'invite'],
    args: [],
    description: 'Sends invite link',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        message.channel.send('If you wana invite me to your server use the invite link: \n' + constants.inviteLink);
    }
}
