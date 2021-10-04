require('dotenv').config();

module.exports = {
    inviteLink: 'https://discord.com/api/oauth2/authorize?client_id=794972667262140426&permissions=2184194112&scope=bot%20applications.commands',
    youtubeLinks: ['AIzaSyCT7SvTzyZX23d6mewlqNbQ3AIM_3b10uk', 'AIzaSyCetJQJ84jKok4jIBvEwZbM9fW-GZWLTqg'],
    env: {
        defaultPrefix: process.env.DEFAULT_DISCORD_PREFIX,
        ownerId: process.env.OWNER_ID,
    },
    data: {
        clientDataPath: 'data/clientData.json',
        guildDataPath: 'data/guildData.json'
    }
}