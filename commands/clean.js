const delay = async (ms) => await new Promise(res => setTimeout(res, ms));
module.exports = {
    name: 'clean',
    description: 'Clears all messages ment for the bot',
    args: [],
    commands: ['clean', 'cln'],
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        try {
            const defaultPrefix = constants.env.defaultPrefix;
            let msgToDelete = await message.channel.messages.fetch().then((results) => results.filter(msg => msg.content[0] === defaultPrefix || msg.content[0] === prefix || msg.author.id === constants.env.botId))
            let msgToDeleteCount = [...Array.from(msgToDelete.keys()).keys()].length;
            await message.channel.bulkDelete(msgToDelete);
            message.channel.send(`${msgToDeleteCount} messages deleted successfuly!`)
                .then(msg => delay(5000)
                    .then(() => msg.delete().catch(err => err.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE ? undefined : console.error('Error coudn\'t delete alert clean msg'))));
        }
        catch (error) {
            console.log('@ clean', error)
        };
    }
};
