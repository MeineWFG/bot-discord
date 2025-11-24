const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emit')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
		.setDescription('Emettre un événement au choix !')
        .addStringOption(option =>
            option.setName('event')
                .setDescription('Choisir un événement à emettre')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'guildMemberAdd',
                        value: 'guildMemberAdd',
                    },
                    {
                        name: 'guildMemberRemove',
                        value: 'guildMemberRemove',
                    },
                )),
	async execute(interaction) {
        const evtChoices = interaction.options.getString('event');
        interaction.client.emit(evtChoices, interaction.member);
        interaction.reply({ content: `Événement ${evtChoices} émit`, flags: MessageFlags.Ephemeral})
	},
};
