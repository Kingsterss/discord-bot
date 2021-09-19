require('dotenv').config();

module.exports = {
    env: {
        defaultPrefix: process.env.DEFAULT_DISCORD_PREFIX,
        ownerId: process.env.OWNER_ID,
        botId: process.env.BOT_ID
    },
    data: {
        clientDataPath: 'data/clientData.json',
        guildDataPath: 'data/guildData.json'
    }
}