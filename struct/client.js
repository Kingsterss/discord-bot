const constants = require('./constants');
const { Client, Collection } = require('discord.js');
const business = require('./business.js')

const GetData = {
    clientData: business.getClientData(),
    guildData: business.getGuildData()
}

module.exports = class extends Client {
    constructor(config) {
        super({
            disableMentions: 'everyone'
        });

        this.owner = constants.env.ownerId;
        this.data = GetData;
        this.commands = new Collection();
        this.queue = new Map();
        this.queueFilling = false;
        this.radioMode = false;
        this.config = config;

        this.setClientStatusData = (msg, type, isSetting = true) => {
            const dataTransfer = {
                msg: msg,
                type: type
            }
            business.setClientStatusData(dataTransfer);
            if (isSetting) this.user.setActivity(msg, { type: type });
            else this.user.setActivity(null);
        };
        this.guildData = (id) => business.findGuildServerData(id);
        this.prefixGuildData = (id, prefix) => {
            business.prefixGuildData(business.findGuildServerData(id), prefix);
        }
        this.getPrefix = (id) => business.prefixGuildData(business.findGuildServerData(id), null, true);
    }
};
