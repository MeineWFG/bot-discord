const { config } = require('../../config/config.js');
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closefantasy')
        .setDescription('Fermer une fantasy !'),
    async execute(interaction) {

        // Filtre correctement en comparant la clé "channel"
        config.server.channel.fantasy = config.server.channel.fantasy.filter(
            fantasy => fantasy.channel !== interaction.channel.id
        );

        interaction.reply({
            content: `La fantasy a été fermée`,
            flags: MessageFlags.Ephemeral
        });
    },
};