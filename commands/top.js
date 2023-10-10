const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {getTopFires} = require('../data/sqlite.js');
const {parseTimestamp, limitMessage} = require('../util/formatting.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Show the top fire comments')
        .addNumberOption(option => 
            option
                .setName('page')
                .setDescription('Page number')
                .setRequired(false)
                ),
    async execute(interaction) {
        const page = interaction.options.getNumber('page') ?? 1;

        getTopFires(false, page, async (rows) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`The Most 🔥 Quotes`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png?size=256`);
        
            rows.forEach((row) => {
                embed.addFields(
                    { name: `${parseTimestamp(row.created)} https://discord.com/channels/${row.guildId}/${row.channelId}/${row.messageId}`, value: `"${limitMessage(row.content, 250)}"\n**Rated 🔥${row.rating}**` }
                );
            }); 
            
            await interaction.reply({embeds:[embed]});
        });
    }
}