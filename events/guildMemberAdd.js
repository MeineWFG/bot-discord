const { config } = require('../config/config.js');
const { Events, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const { getRandomElement, getRandomColor } = require('../utils/helpers.js');

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
		try {
			const welcomeChannel = member.guild.channels.cache.get(config.server.channel.welcome);
			if (!welcomeChannel) {
				console.error('[GuildMemberAdd] Channel de bienvenue introuvable.');
				return;
			}

			const randomImage = getRandomElement(config.images.welcome);
			const embed = new EmbedBuilder()
				.setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
				.setColor(getRandomColor())
				.setThumbnail(`attachment://${randomImage}`)
				.setDescription(getRandomElement(config.server.text.welcome));

			await member.roles.add(config.server.role.idValidateRole);
			await welcomeChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], files: [path.join(__dirname, '..', 'images', randomImage)] });
		} catch (error) {
			console.error('[GuildMemberAdd] Erreur:', error);
		}
	},
};
