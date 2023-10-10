const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {getSavedMessages} = require('../data/sqlite.js');
const {parseTimestamp, limitMessage} = require('../util/formatting.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch')
        .setDescription('Find fire quotes by member')
        .addUserOption(option => 
            option 
                .setName('target')
                .setDescription('Member to search')
                .setRequired(true))
        .addNumberOption(option => 
            option
                .setName('page')
                .setDescription('Page number')
                .setRequired(false)
                ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const page = interaction.options.getNumber('page') ?? 1;

        getSavedMessages(target.id, page, async (rows) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Quotes from ${target.username}`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png?size=256`);
        
            rows.forEach((row) => {
                embed.addFields(
                    { name: `${parseTimestamp(row.created)} https://discord.com/channels/${row.guildId}/${row.channelId}/${row.messageId}`, value: `"${limitMessage(row.content, 250)}"\n**Rated 🔥${row.rating}**` }
                );
            }); 
            
            await interaction.reply({embeds:[embed]});
        });
    }
}