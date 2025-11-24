const { config } = require('../config/config.js');
const { Colors, Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
        const welcomeChannel = member.guild.channels.cache.get(config.server.channel.welcome);
        const randomImage = config.images.welcome[Math.floor(Math.random() * config.images.welcome.length)];
        const embed = new EmbedBuilder()
            .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
            .setColor(Colors[Object.keys(Colors)[Math.floor(Math.random() * Object.keys(Colors).length)]])
			.setThumbnail(`attachment://${randomImage}`)
            .setDescription(config.server.text.welcome[Math.floor(Math.random() * config.server.text.welcome.length)])
        
		member.roles.add(config.server.role.idValidateRole);
        welcomeChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], files: [`./images/${randomImage}`] })
	},
};