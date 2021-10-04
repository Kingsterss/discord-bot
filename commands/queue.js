const reactionButtons = ['◀️', '▶️', '🇽'];
const appendButtons = (embed) => reactionButtons.forEach(btn => embed.react(btn));

const textShortener = (text, length) => {
    if (!text) return '';
    if (text.length <= length) return text;
    text = text.substring(0, length);
    last = text.lastIndexOf(' ');
    text = text.substring(0, last);
    return text + '...';
}
const generateQueueEmbed = (queue, Discord, message) => {
    const embeds = [];
    let perPagePos = 10;
    for (let i = 0; i < queue.length; i+=10) {
        const current = queue.slice(i, perPagePos);
        let j = i;
        perPagePos += 10;
        const info = current.map(song => `**${++j}:** [${textShortener(song.title, 69)}](${song.url})`).join('\n');
        const embed = new Discord.MessageEmbed()
            .setDescription(`**Showing ${message.guild.name} queue for ${message.author.username}  - Current Song: [${textShortener(queue[0].title, 50)}](${queue[0].url})**\n\n${info}`);
        embeds.push(embed);
    }
    return embeds;
}

module.exports = {
    name: 'queue',
    commands: ['q', 'queue'],
    args: [],
    description: 'Displays the queue',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        if (!serverQueue) return message.channel.send('The queue is empty');
        const filter = (reaction, user) => reactionButtons.includes(reaction.emoji.name) && (message.author.id === user.id);
        let currPage = 0;
        const embeds = await generateQueueEmbed(serverQueue.songs, Discord, message);
        const queueEmbed = await message.channel.send(`Current Page: ${currPage + 1}/${embeds.length} `, embeds[currPage]);
        await appendButtons(queueEmbed);
        const reactionCollector = queueEmbed.createReactionCollector(filter)

        reactionCollector.on('collect', async (reaction) => {
            if (reaction.emoji.name === reactionButtons[1]) {
                if (currPage < embeds.length - 1) {
                    ++currPage
                    queueEmbed.edit(`Current Page: ${currPage + 1}/${embeds.length}`, embeds[currPage]);
                }
            }
            else if (reaction.emoji.name === reactionButtons[0]){
                if (currPage !== 0) {
                    --currPage
                    queueEmbed.edit(`Current Page: ${currPage + 1}/${embeds.length}`, embeds[currPage]);
                }
            }
            else if (reaction.emoji.name === reactionButtons[2]) {
                reactionCollector.stop();
                return await queueEmbed.delete();
            }
        });
    }
}