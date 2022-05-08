const { SlashCommandBuilder, bold, blockQuote } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
const { request } = require('http');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createnote')
        .setDescription('Creates a notion page under `meeting notes`.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('what would you like to call this page in notion?')
                .setRequired(true)),
    async execute(interaction) {
        start(interaction);
    },
    async executeSelect(interaction) {
        handleSelect(interaction);
    },
    async executeButton(interaction) {
        handleButton(interaction);
    }
}

let title;

const start = async (interaction) => {
    console.log('start create-note command');
    // first check if user is in notion page 
    title = interaction.options.getString('title');
    engNotebook = interaction.options.getBoolean('eng_notebook');

    await interaction.reply({ content: `Hello! Please select the subteam categories you'd like to attach to this note:`, components: createComponents() });
}

const handleSelect = async (interaction) => {
    console.log('made it into the reply select');

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Creating Note')
        .setDescription(blockQuote(bold('Title: ') + title + '\n' + bold('Tags: ') + interaction.values));

    // await interaction.update({ content: " ", embeds: [embed], components: [] });
    await interaction.update({ content: blockQuote(bold('Title: ') + title + '\n' + bold('Tags: ') + interaction.values), components: [] });

    // add notion page creation here 😵😵

    await interaction.followUp({ content: 'does this work too?? ' });
}

const handleButton = async (interaction) => {
    console.log('made it into the handle button method');
    console.log('buttonType: ', interaction.customId);

    switch (interaction.customId) {
        case 'createButton':
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                .setDescription('Some description here');

            await interaction.reply({ content: 'Clicked create button', components: [], embeds: [embed] });

            break;
        case 'cancelButton':
            await interaction.reply({ content: 'Clicked cancel button', components: [] });
            break;
        default:
            break;
    }
}

const createComponents = () => {
    const meetingNoteTagsSelect = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('noteTags')
                .setPlaceholder('Nothing selected')
                .setMaxValues(5)
                .addOptions([
                    {
                        label: 'Design',
                        description: 'adds a Design tag',
                        value: 'design',
                    },
                    {
                        label: 'Mechanical',
                        description: 'adds a Mechanical tag',
                        value: 'mechanical',
                    },
                    {
                        label: 'Programming',
                        description: 'adds a Programming tag',
                        value: 'programming',
                    },
                    {
                        label: 'Imagery',
                        description: 'adds a Imagery tag',
                        value: 'imagery',
                    },
                    {
                        label: 'Business',
                        description: 'adds a Business tag',
                        value: 'business',
                    },
                ]));

    // const createButton = new MessageButton()
    //     .setCustomId('createButton')
    //     .setLabel('create')
    //     .setStyle('PRIMARY');

    // const cancelButton = new MessageButton()
    //     .setCustomId('cancelButton')
    //     .setLabel('cancel')
    //     .setStyle('SECONDARY');

    // const buttons = new MessageActionRow()
    //     .addComponents(
    //         createButton,
    //         cancelButton,
    //     );

    // return [meetingNoteTagsSelect, buttons];

    return [meetingNoteTagsSelect];
}