const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping du bot !'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
            .setTitle('🏓 Pong !')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'Latence', value: `\`${interaction.client.ws.ping}ms\``, inline: true},
                { name: 'Uptime', value: `<t:${parseInt(interaction.client.readyTimestamp / 1000)}:R>`, inline: true}
            )
            .setTimestamp()
            .setFooter({ text: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() });
        await interaction.reply({embeds: [embed]});
	},
};
