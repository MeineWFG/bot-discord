const cron = require('node-cron');
const { cronJSON, serverJSON } = require('../json/config.json');
const { Events } = require('discord.js');
const { getStreamData } = require('../functions/twitch/getStreamData.js');
const { updateToken } = require('../functions/twitch/updateToken.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		//Tâche de lancement
		updateToken();
		console.log(`Prêt ! Connecté en tant que ${client.user.tag}`);

		//Tâche Cron
		cron.schedule(cronJSON.getStreamData, () => {
			getStreamData(client.channels.cache.get(serverJSON.channel.announcement));
		})

		cron.schedule(cronJSON.updateToken, () => {
			updateToken();
		})
	},
};
