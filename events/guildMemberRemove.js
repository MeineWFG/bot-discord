const { config } = require('../config/config.js');
const { Events, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const { getRandomElement, getRandomColor } = require('../utils/helpers.js');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
		try {
			const quitChannel = member.guild.channels.cache.get(config.server.channel.quit);
			if (!quitChannel) {
				console.error('[GuildMemberRemove] Channel de départ introuvable.');
				return;
			}

			const randomImage = getRandomElement(config.images.quit);
			const embed = new EmbedBuilder()
				.setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
				.setColor(getRandomColor())
				.setThumbnail(`attachment://${randomImage}`)
				.setDescription(`Rejoint le: <t:${parseInt(member.joinedTimestamp / 1000)}:f>
				Quitté le: <t:${parseInt(Date.now() / 1000)}:f>`)
				.setFooter({text: 'Adieu !' });

			await quitChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], files: [path.join(__dirname, '..', 'images', randomImage)] });
		} catch (error) {
			console.error('[GuildMemberRemove] Erreur:', error);
		}
	},
};
