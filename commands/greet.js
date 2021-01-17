const { Guild } = require("discord.js");

module.exports = {
    name: 'greet',
    description: "this is a greet command!",
    execute(message, args){
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        let num = getRandomInt(3);
        switch (num) {
            case 0:
                message.channel.send('O');
                break;
            case 1:
                message.channel.send('Yo');
                break;
            case 2:
                message.channel.send('Oho');
                break;
        }
    }
};