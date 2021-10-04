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
        this.queueFilling = false;
        this.radioMode = false;
        this.config = config;

        this.youtubeKey = (type) => business.youtubeKey(type);
        this.setClientStatusData = (msg, type, isSetting = true) => {
            const dataTransfer = {
                msg: msg,
                type: type
            }
            business.setClientStatusData(dataTransfer);
            if (isSetting) this.user.setActivity(msg, { type: type });
            else this.user.setActivity(null);
        };
        this.setPfp = (img) => {
            let result = 'Successfully changed pfp';
            this.user.setAvatar(img).catch(err => result = err)
            return result;
        };
        this.guildData = (id) => business.findGuildServerData(id);
        this.prefixGuildData = (id, prefix) => business.prefixGuildData(id, prefix);
        this.getPrefix = (id) => business.prefixGuildData(id, null, true);
    }
};
