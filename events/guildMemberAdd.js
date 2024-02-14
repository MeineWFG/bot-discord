const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const { imagesJSON, serverJSON } = require('../json/config.json');

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
        const welcomeChannel = member.guild.channels.cache.get(serverJSON.channel.welcome);
        const randomImage = imagesJSON.welcome[Math.floor(Math.random() * imagesJSON.welcome.length)];
        const embed = new EmbedBuilder()
            .setAuthor({name: member.user.username, iconURL: member.displayAvatarURL()})
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
			.setThumbnail(`attachment://${randomImage}`)
            .setDescription(serverJSON.text.welcome[Math.floor(Math.random() * serverJSON.text.welcome.length)])
        
		member.roles.add(serverJSON.role.idValidateRole);
        welcomeChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], files: [`./images/${randomImage}`] })
	},
};