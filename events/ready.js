const { config } = require('../config/config.js');
const cron = require('node-cron');
const { Events } = require('discord.js');
const { notifyLive } = require('../functions/twitch/notifyLive.js');
const { updateToken } = require('../functions/twitch/updateToken.js');
const { processRss } = require('../functions/rss/processRss.js');
const { initRssMemory } = require('../functions/rss/initRssMemory.js'); 

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		//Tâche de lancement
		await updateToken();
		await initRssMemory(client);
		console.log(`Prêt ! Connecté en tant que ${client.user.tag}`);

		//Tâche Cron

		//Notifie live twitch
		cron.schedule(config.cron.notifyLive, () => {
			notifyLive(client.channels.cache.get(config.server.channel.announcement));
		})

		//Update token twitch
		cron.schedule(config.cron.updateToken, () => {
			updateToken();
		})
		
		//RSS
		cron.schedule(config.cron.getRss, () => {
			processRss(client);
		});
	},
};