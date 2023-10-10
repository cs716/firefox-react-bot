const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomMessage } = require('../data/sqlite.js');
const { parseTimestamp, limitMessage } = require('../util/formatting.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Show a random fire quote (optionally by member)')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Member to search')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target') ?? undefined;
        if (target !== undefined) {
            getRandomMessage(target.id, async (row) => {
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`Random 🔥 Quote from ${target.username}`)
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png?size=256`);

                embed.addFields(
                    { name: `${parseTimestamp(row.created)} https://discord.com/channels/${row.guildId}/${row.channelId}/${row.messageId}`, value: `"${limitMessage(row.content, 250)}"\n**Rated 🔥${row.rating}**` }
                );

                await interaction.reply({ embeds: [embed] });
            });
        } else {
            getRandomMessage(undefined, async (row) => {
                interaction.client.users.fetch(row.userId)
                    .then(async (res) => {
                        const embed = new EmbedBuilder()
                            .setColor(0x0099ff)
                            .setTitle(`Random 🔥 Quote from ${res.username}`)
                            .setThumbnail(`https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.png?size=256`);

                        embed.addFields(
                            { name: `${parseTimestamp(row.created)} https://discord.com/channels/${row.guildId}/${row.channelId}/${row.messageId}`, value: `"${limitMessage(row.content, 250)}"\n**Rated 🔥${row.rating}**` }
                        );

                        await interaction.reply({ embeds: [embed] });
                    });
            });
        }
    }
}