const cron = require('node-cron');
const { cronJSON } = require('../json/config.json');
const { Events } = require('discord.js');
const { updateToken } = require('../functions/twitch/updateToken.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		//Tâche de lancement
		updateToken();
		console.log(`Prêt ! Connecté en tant que ${client.user.tag}`);

		//Tâche Cron
		cron.schedule(cronJSON.updateToken, () => {
			updateToken();
		})

	},
};
