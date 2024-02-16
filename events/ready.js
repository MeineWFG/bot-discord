const cron = require('node-cron');
const { cronJSON, serverJSON } = require('../json/config.json');
const { Events } = require('discord.js');
const { notifyLive } = require('../functions/twitch/notifyLive.js');
const { updateToken } = require('../functions/twitch/updateToken.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		//Tâche de lancement
		updateToken();
		console.log(`Prêt ! Connecté en tant que ${client.user.tag}`);

		//Tâche Cron
		cron.schedule(cronJSON.notifyLive, () => {
			notifyLive(client.channels.cache.get(serverJSON.channel.announcement));
		})

		cron.schedule(cronJSON.updateToken, () => {
			updateToken();
		})
	},
};
