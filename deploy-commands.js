require('dotenv/config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const tokenId = process.env.DISCORD_NOTION_BOT_TOKEN;
const clientId = process.env.DISCORD_NOTION_BOT_CLIENT_ID;
const guildId = process.env.DISCORD_NOTION_BOT_GUILD_ID;

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9'}).setToken(tokenId);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.'); 
        console.log('body', commands);
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        
        console.log('Successfully reloaded application (/) commands.');

    } catch (error) {
        console.error(error);
    }
})();