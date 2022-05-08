require('dotenv/config')
const { Client, Collection, Intents } = require('discord.js');

const fs = require('node:fs');

const createBot = () => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ]
    });

    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    }

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    })

    client.on('messageCreate', async message => {
        if (message.mentions.has(client.user)) {
            console.log("received message hehe");
            message.reply("Hello " + message.author.username);
        }
    })

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        console.log('in command handler');

        const command = fetchCommand(client.commands, interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
        }
    });

    /*
    SELECT MENU HANDLER
    */
    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;
        console.log('in select menu handler');
        
        const command = fetchCommand(client.commands, interaction.message.interaction.commandName);
        if (!command) return;

        try {
            await command.executeSelect(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true});
        }
    });


    /* 
    BUTTON HANDLER
    */
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;
        console.log('in button handler');
        // console.log(interaction);
        const command = fetchCommand(client.commands, interaction.message.interaction.commandName)
        if (!command) return;

        try {
            await command.executeButton(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true});
        }
    });

    client.login(process.env.DISCORD_NOTION_BOT_TOKEN);
}

const fetchCommand = (commands, commandName) => {
    return commands.get(commandName)
}

exports.createBot = createBot;