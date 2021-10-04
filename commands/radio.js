const includeAny = (arg, col) => {
    for (const val of col)
        if (val.name === arg)
            return true
    return false;
}
module.exports = {
    name: 'radio',
    commands: ['radio', 'rd'],
    args: ['Sr', 'Veronika', 'Veselina'],
    description: 'Turns the radio mode',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if (serverQueue) serverQueue.queue = [];
        const radioData = message.client.data.clientData.radioLinks;
        if (!includeAny(`${args[0] ?? ''}`.replace(/(^\w|\s\w)/g, m => m.toUpperCase()), radioData)) {
            let radioInfoMessage = 'Available radios:';
            radioData.forEach(radioInfo => radioInfoMessage += '\n - ' + radioInfo.name);
            return message.channel.send(radioInfoMessage);
        }
        message.member.voice.channel.join().then(VoiceConnection => {
            message.guild.me.voice.setSelfDeaf(true);
            radioData.forEach(radioInfo => {
                if (radioInfo.name.toLowerCase() !== args[0]) return;
                VoiceConnection.play(radioInfo.link);
                return message.channel.send(`Switched to Radio ${radioInfo.name} mode 📻`);
            });
            message.client.radioMode = true;
        }).catch(e => console.log(e));
    }
}
