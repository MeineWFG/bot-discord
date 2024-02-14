const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emit')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
		.setDescription('Emettre un évènement au choix !')
        .addStringOption(option =>
            option.setName('event')
                .setDescription('Choisir un évènement à emettre')
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
        if(evtChoices == 'guildMemberAdd'){
            interaction.client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: 'Event guildMemberAdd emit', ephemereal: true})
        }else{
            interaction.client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content: 'Event guildMemberRemove emit', ephemereal: true})
        }
        
	},
};
