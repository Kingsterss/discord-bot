var Scraper = require('images-scraper');
const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});
module.exports = {
    name: 'image',
    commands: ['img'],
    args: ['keyword'],
    description: 'Searches for an image',
    async execute(message, args, constants, serverQueue, Discord, prefix) {
        const searchString = args.join(' ');
        if (!searchString) return message.channel.send('Please enter a search argument!');
        let imgResult = await google.scrape(searchString, 1).then(result => result[0].url).catch(e => 'No image found.');
        return message.channel.send(imgResult);
    }
}
