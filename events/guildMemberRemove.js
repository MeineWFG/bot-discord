const { config } = require('../config/config.js')
const { Colors, Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
        const quitChannel = member.guild.channels.cache.get(config.server.channel.quit);
        const randomImage = config.images.quit[Math.floor(Math.random() * config.images.quit.length)];
        const embed = new EmbedBuilder()
            .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
            .setColor(Colors[Object.keys(Colors)[Math.floor(Math.random() * Object.keys(Colors).length)]])
			.setThumbnail(`attachment://${randomImage}`)
            .setDescription(`Rejoint le: <t:${parseInt(member.joinedTimestamp / 1000)}:f>
                Quitté le: <t:${parseInt(Date.now() / 1000)}:f>`)
            .setFooter({text: 'Adieu !' })

        quitChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], files: [`./images/${randomImage}`] })
	},
};