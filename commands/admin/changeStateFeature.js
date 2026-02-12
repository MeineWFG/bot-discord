const { config } = require('../../config/config.js');
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changestatefeature')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
		.setDescription('Activer/Désactiver une feature !')
        .addStringOption(option =>
            option.setName('feature')
                .setDescription('Choisir une feature')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'bibooMove',
                        value: 'bibooMove',
                    },
                )),
	async execute(interaction) {
        const evtChoices = interaction.options.getString('feature');

        const newStateFeature = !config.flagFeature[evtChoices];

        //Actualisation de la feature
        config.flagFeature[evtChoices] = newStateFeature;

        await interaction.reply({ content: `La feature ${evtChoices} a été ${newStateFeature ? "activé" : "désactivé"} !`, flags: MessageFlags.Ephemeral });
	},
};
