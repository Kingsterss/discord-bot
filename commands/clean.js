module.exports = {
    name: 'clean',
    description: 'Clears the messages from the bot and messages starting with prefix',
    execute(message, args, prefix) {
        message.channel.messages.fetch().then((results) => {
            let messagesForDelete = results.filter(msg => msg.content[0] === prefix || msg.author.id === '794972667262140426');
            message.channel.bulkDelete(messagesForDelete);
        }).catch();
    }
};