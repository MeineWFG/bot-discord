const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

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

        //Lecture du fichier config.json
        var configJSON = JSON.parse(fs.readFileSync('./json/config.json'));

        const newStateFeature = configJSON.flagFeature[evtChoices] == "true" ? "false" : "true";

        //Actualisation de la feature
        configJSON.flagFeature[evtChoices] = newStateFeature

        //Réecriture du fichier config.json avec format
        fs.writeFileSync('./json/config.json', JSON.stringify(configJSON, null, 2));

        interaction.reply({ content: `La feature ${evtChoices} a été ${newStateFeature == "true" ? "activé" : "désactivé"} !`, ephemereal: true})
	},
};
