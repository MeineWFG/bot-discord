const { config } = require('../../config/config.js');
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createfantasy')
		.setDescription('Créer une fantasy !'),
	async execute(interaction) {
        config.server.channel.fantasy.push({
                channel: interaction.channel.id,
                players: []
            }
        );
        interaction.reply({ content: `La fantasy a été créée`, flags: MessageFlags.Ephemeral })
	},
};