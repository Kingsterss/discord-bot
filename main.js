require('dotenv').config();
const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const fs = require('fs');
const clientCtor = require('./struct/client');
const client = new clientCtor({ token: process.env.DISCORD_TOKEN, prefix: process.env.DISCORD_PREFIX });

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on("ready", () => console.log("Kis bot is now Online!"));

client.on("message", async (message) => {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot)
        return;

    const serverQueue = message.client.queue.get(message.guild.id);
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'play': case 'p':
            client.commands.get('play').execute(message, serverQueue, args);
            break;
        case 'stop':
            client.commands.get('stop').execute(message, serverQueue);
            break;
        case 'skip':
            client.commands.get('skip').execute(message, serverQueue);
            break;
        case 'pause':
            client.commands.get('pause').execute(message);
            break;
        case 'resume':
            client.commands.get('resume').execute(message);
            break;
        case 'queue':
            client.commands.get('queue').execute(message);
            break;
        case 'help': case 'commands': case 'info':
            client.commands.get('info').execute(message, args, Discord, client.config.prefix);
            break;
        case 'invite':
            client.commands.get('invite link').execute(message);
            break;
        case 'mc': case 'minecraft': case 'mcinfo':
            client.commands.get('minecraftStatus').execute(message, Discord);
            break;
        case 'leave': case 'adios':
            client.commands.get('leave').execute(message, args);
            break;
        case 'clean':
            client.commands.get('clean').execute(message, args, client.config.prefix);
            break;
        case 'o': case 'yo': case 'oho':
            client.commands.get('greet').execute(message, args)
            break;
    }
})

client.login(client.config.token);