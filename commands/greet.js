const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
module.exports = {
    name: 'greet',
    description: 'This is a greet command!',
    args: [],
    commands: ['o', 'oho', 'yo'],
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        message.channel.send(this.commands[getRandomInt(3)]);
    }
};
