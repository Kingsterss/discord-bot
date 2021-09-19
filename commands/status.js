module.exports = {
    name: 'status',
    commands: ['status'],
    args: ['set', 'clear', 'update'],
    description: 'Changes the bot\'s custom status (only invokeable from the bot\'s author)',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if (message.author.id !== message.client.owner) return message.channel.send('You can\'t use this command!');
        const action = args.shift();
        if (action === 'set')
            set(message, args.shift(), args.join(' '));
        else if (action === 'clear')
            clear(message);
    }
}
const set = (message, type, msg) => message.client.setClientStatusData(msg, type.toUpperCase())
const clear = (message) => message.client.setClientStatusData('', '', false)
