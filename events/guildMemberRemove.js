const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const { imagesJSON, serverJSON } = require('../json/config.json')

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
        const quitChannel = member.guild.channels.cache.get(serverJSON.channel.quit);
        const randomImage = imagesJSON.quit[Math.floor(Math.random() * imagesJSON.quit.length)];
        const embed = new EmbedBuilder()
            .setAuthor({name: member.user.username, iconURL: member.displayAvatarURL()})
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
			.setThumbnail(`attachment://${randomImage}`)
            .setDescription(`Rejoint le: <t:${parseInt(member.joinedTimestamp / 1000)}:f>
                Quitté le: <t:${parseInt(Date.now() / 1000)}:f>`)
            .setFooter({text: 'Adieu !' })

        quitChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], files: [`./images/${randomImage}`] })
	},
};