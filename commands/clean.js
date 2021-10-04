const delay = async (ms) => await new Promise(res => setTimeout(res, ms));
module.exports = {
    name: 'clean',
    description: 'Clears all messages ment for the bot',
    args: [],
    commands: ['clean', 'cln'],
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        try {
            const defaultPrefix = constants.env.defaultPrefix;
            let msgToDelete = await message.channel.messages.fetch().then((results) => results.filter(msg => msg.content[0] === defaultPrefix || msg.content[0] === prefix || message.author === message.client.user))
            let msgToDeleteCount = [...Array.from(msgToDelete.keys()).keys()].length;
            message.channel.send(`Deleting ${msgToDeleteCount} messages in 10 sec (type 'abort' to cancel or yes/y to confirm)`)
            let response = await message.channel.awaitMessages(
                msg => (msg.content > 0 && msg.content < 7) || msg.content === 'abort',
                {
                    max: 1,
                    maxProcessed: 1,
                    time: 10000,
                    errors: ['time']
                }
            );
            if (response.first().content === 'abort') return message.channel.send('Clean canceled!')
                .then(msg => delay(5000)
                    .then(() => msg.delete().catch(err => err.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE ? undefined : console.error('Error coudn\'t delete alert clean msg'))));
            await message.channel.bulkDelete(msgToDelete, true);
            message.channel.send(`${msgToDeleteCount} messages deleted successfuly!`)
                .then(msg => delay(5000)
                    .then(() => msg.delete().catch(err => err.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE ? undefined : console.error('Error coudn\'t delete alert clean msg'))));
        }
        catch (error) {
            console.log('@ clean', error)
        };
    }
};
