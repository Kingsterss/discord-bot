module.exports = {
    name: 'info',
    commands: ['info', 'help', 'commands'],
    args: [],
    description: 'Prints the bot commands as embed message',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const commandList = [];
        message.client.commands.forEach(com => {
            if(message.client.data.clientData.hiddenCommands.includes(com.name)) return;
            const optionalArgs = com.args.length > 0 ? ` {${com.args.join('/')}}` : '';
            commandList.push('> **' + prefix + com.commands.join('/') + optionalArgs + '** \n > ``' + com.description + '``')
        });
        const embedInfo = new Discord.MessageEmbed()
            .setColor('#00FBFF')
            .setTitle(':information_source: Info :information_source:')
            .addFields(
                { name: ':wave: Hello, here you can see information about me.', value: '\u200B' },
                { name: ':pencil: Command list', value: commandList},
                { name: ':calendar_spiral:', value: '[Trello board](https://trello.com/b/N7LJzeZK/kisbot)' }
            )
            .setImage('https://bn1301files.storage.live.com/y4mz_XdND6b9cqoLM_D8Y5JgqqUb_0t2LITpja7AGRnV2EKzCjP9X8P7F6_bpfmHtmLEnzvpT75WccL86rqFPLv6yOQEAam3enEcMBMd7FNCZdTPt8A5YzTEcmN7jPDY642dJZr1wwM5lJ9Pa8x9LvuOUHih1Gt8V97KVe-3_-Df_6VdBoikSkoWuCnT0jJwP7v?width=681&height=676&cropmode=none')
            .setFooter('Remember. Keep it simple!')
        message.channel.send(embedInfo)
    }
}
