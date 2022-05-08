const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-note')
        .setDescription('Creates a notion page under `meeting notes`.'),
    async execute(interaction) {
        start(interaction);
    },
    async replySelect(interaction) {
        replySelect(interaction);
    }
}

const start = async (interaction) => {
    console.log('start create-note command')
    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('noteTags')
                .setPlaceholder('Nothing selected')
                .setMaxValues(5)
                .addOptions([
                    {
                        label: 'Design',
                        description: 'adds a Design tag',
                        value: 'design_option',
                    },
                    {
                        label: 'Mechanical',
                        description: 'adds a Mechanical tag',
                        value: 'mechanical_option',
                    },
                    {
                        label: 'Programming',
                        description: 'adds a Programming tag',
                        value: 'programming_option',
                    },
                    {
                        label: 'Imagery',
                        description: 'adds a Imagery tag',
                        value: 'imagery_option',
                    },
                    {
                        label: 'Business',
                        description: 'adds a Business tag',
                        value: 'business_option',
                    },
                ]));

    
    await interaction.reply({ content: 'Hello!', components: [row] });
}

const replySelect = async (interaction) => {
    console.log('made it into the reply select');
    // create notion page
    // return embed with 
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setDescription('Some description here');

    await interaction.reply({ content: 'Something was selected!', components: [], embeds: [embed] });
}