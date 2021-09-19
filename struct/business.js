const constants = require('./constants');
const fs = require('fs');

const rawClientData = fs.readFileSync(constants.data.clientDataPath);
const rawGuildData = fs.readFileSync(constants.data.guildDataPath);

const clientData = JSON.parse(rawClientData);
const guildData = JSON.parse(rawGuildData);

const serverUniqueCtor = {
    queue: [],
    prefix: constants.defaultPrefix
}

const serverUniqueQueueCtor = {
    name: '',
    songs: []
}

module.exports = {
    getClientData() { return clientData },
    getGuildData() { return guildData },
    setClientStatusData(additionalData) {
        const data = clientData.author.status = additionalData;
        fs.writeFileSync('data/ClientData.json', JSON.stringify(clientData));
    },
    findGuildServerData(id) {
        const guildIdExist = guildData.serverUnique.hasOwnProperty(id);
        if (!guildIdExist) {
            guildData.serverUnique[id] = serverUniqueCtor;
            fs.writeFileSync(constants.data.guildDataPath, JSON.stringify(guildData));
        }
        const dataExport = {
            id: id,
            data: guildData.serverUnique[id]
        }
        return dataExport;
    },
    prefixGuildData(guildServerData, newPrefix, isGet = false) {
        if (isGet) return guildServerData.data.prefix;
        if(!newPrefix) console.error('No prefix arg was given!');

        guildData.serverUnique[guildServerData.id].prefix = newPrefix;
        fs.writeFileSync(constants.data.guildDataPath, JSON.stringify(guildData));
    }
}