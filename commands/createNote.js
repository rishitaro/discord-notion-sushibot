const { SlashCommandBuilder, bold, italic, blockQuote, inlineCode, hyperlink } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
const { getUser, createMeetingNotesPage } = require('../notion.js');

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
let requester;

const start = async (interaction) => {
    console.log('start create-note command');
    requester = await getUser(interaction.user.username);
    if (!requester) {
        await interaction.reply({ content: "Sorry, you don't have permission to create Notion pages. If you believe this is a mistake, please ensure you are in the Team Roster DB or request Notion access by invoking " + inlineCode('/notioninvite') + '.'})
        return;
    } else {
        console.log('User exists in Notion db, proceeding with command');
    }

    title = interaction.options.getString('title');

    await interaction.reply({ content: `Please select the subteam categories you'd like to attach to this note:`, components: createComponents() });
}

const handleSelect = async (interaction) => {
    console.log('made it into the reply select');

    if (interaction.customId === 'noteTags') {
        // update initial slash command reply to remove selector once acked
        await interaction.update({ content: bold('Creating page with the following properties:')+ '\n' + blockQuote(italic('Title:') + ' ' + title + '\n' + italic('Tags:') + ' ' + interaction.values), components: [] });

        try {
            // create page in notion
            const notionPageResponse = await createMeetingNotesPage(title, interaction.values, requester);

            // create message embed 
            const description = italic(`The page was created under the ${hyperlink('Meeting Notes', 'https://www.notion.so/redmondrobotics/Meeting-Notes-b1cc40e291104bb6ab8cb2ccbf79150f')} section in the 7461 workspace.`);

            const embed = new MessageEmbed()
                .setColor('#FCD6F6')
                .setTitle(`${title} - Notion Page Link`)
                .setURL(notionPageResponse.url)
                .setDescription(description)
                .setThumbnail('https://i.ibb.co/6sD4Kb0/Group-1sparkie.png');

            // send followup
            await interaction.followUp({ content: ' ', embeds: [embed] });
        } catch (exception) {
            // exception should already be logged at this point 
            await interaction.followUp({content: 'There was a problem processing your request. Please try again later.', ephemeral: true})
        }

        title = '';
        requester = null;
    }
}

const createComponents = () => {
    const meetingNoteTagsSelect = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('noteTags')
                .setPlaceholder('Add note types')
                .setMaxValues(5)
                .addOptions([
                    {
                        label: 'Design',
                        description: 'adds a Design tag',
                        value: 'Design',
                    },
                    {
                        label: 'Mechanical',
                        description: 'adds a Mechanical tag',
                        value: 'Mechanical',
                    },
                    {
                        label: 'Programming',
                        description: 'adds a Programming tag',
                        value: 'Programming',
                    },
                    {
                        label: 'Imagery',
                        description: 'adds a Imagery tag',
                        value: 'Imagery',
                    },
                    {
                        label: 'Business',
                        description: 'adds a Business tag',
                        value: 'Business',
                    },
                    {
                        label: 'Leadership',
                        description: 'adds a Leadership Weekly Meeting tag',
                        value: 'Leadership Weekly Meeting'
                    },
                    {
                        label: 'Post <action> debrief',
                        description: 'i.e. post comp debrief; adds a Post-mortem tag',
                        value: 'Post-mortem'
                    },
                    {
                        label: 'Other', 
                        description: "doesn't fit other categories; adds Ad Hoc tag",
                        value: 'Ad Hoc'
                    },
                ]));

    return [meetingNoteTagsSelect];
}