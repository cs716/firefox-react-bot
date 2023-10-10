const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../data/sqlite.js');
const { parseTimestamp, limitMessage } = require('../util/formatting.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the top fire members')
        .addNumberOption(option =>
            option
                .setName('page')
                .setDescription('Page number')
                .setRequired(false)
        ),
    async execute(interaction) {
        const page = interaction.options.getNumber('page') ?? 1;

        getLeaderboard(page, async (rows) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`The Most 🔥 Members`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png?size=256`);
            
            var idList = [];
            var idRes = {};
            console.log(rows);

            rows.forEach((row) => {
                idList.push(row.userId);
            });

            interaction.guild.members.fetch({user: idList})
                .then(async (res) => {
                    res.forEach((user) => {
                        idRes[user.id] = {
                            username: user.user.username,
                            avatar: user.user.avatar
                        }
                    });

                    var i = 1;
                    rows.forEach((row) => {
                        embed.addFields(
                            { name: `${(i == 1 ? "👑" : i+": ")}${idRes[row.userId].username}`, value: `**Rating: 🔥x${row.totalRating}**\nFire Messages: ${row.totalMessages}` }
                        );

                        if (i == 1)
                            embed.setThumbnail(`https://cdn.discordapp.com/avatars/${row.userId}/${idRes[row.userId].avatar}.png?size=256`)
                        i++;
                    });
                    await interaction.reply({ embeds: [embed] });
                });            
        });
    }
}