const constants = require('./constants');
const fs = require('fs');

const rawClientData = fs.readFileSync(constants.data.clientDataPath);
const rawGuildData = fs.readFileSync(constants.data.guildDataPath);

const clientData = JSON.parse(rawClientData);
const guildData = JSON.parse(rawGuildData);

const serverUniqueCtor = {
    queue: [],
    prefix: constants.env.defaultPrefix
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
            console.log(guildData.serverUnique[id]);
            fs.writeFileSync(constants.data.guildDataPath, JSON.stringify(guildData));
        }
        const dataExport = {
            id: id,
            data: guildData.serverUnique[id]
        }
        return dataExport;
    },
    prefixGuildData(id, newPrefix, isGet = false) {
        let guildServerData = this.findGuildServerData(id);
        if (isGet) return guildServerData.data.prefix;
        if(!newPrefix) console.error('No prefix arg was given!');
        try {
            guildData.serverUnique[guildServerData.id].prefix = newPrefix;
            fs.writeFileSync(constants.data.guildDataPath, JSON.stringify(guildData));
        } catch (error) { return false; }
        return true;
    },
    youtubeKey(get = true) {
        let data = clientData.youtubeKeyId;
        if(get) return data;
        data = data === 0 ? 1 : 0;
        clientData.youtubeKeyId = data;
        fs.writeFileSync('data/ClientData.json', JSON.stringify(clientData));
    }
}