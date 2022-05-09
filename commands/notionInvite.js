const { SlashCommandBuilder, hyperlink, italic } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notioninvite')
        .setDescription('Outputs our Notion workspace invite link'),
    async execute(interaction) {
        start(interaction);
    }
}

const start = async (interaction) => {
    console.log('Outputting notion invite embed')
    const notionInviteLink = hyperlink('invite link', process.env.NOTION_INVITE_LINK); 
    const embed = new MessageEmbed()
        .setTitle('Sushi Squad Notion')
        .setURL('https://www.notion.so/redmondrobotics/7461-Sushi-Squad-c5838d8978c048ad80b9abdccae699ee')
        .setColor('#81F4E1')
        .setDescription(italic(`If you haven't joined the team notion yet, please join using this ${notionInviteLink} and DM @rishita with your account email`))
        .setThumbnail('https://i.ibb.co/7Js6nLH/Group-3nori.png');

    await interaction.reply({ content: ' ', embeds: [embed]});
}