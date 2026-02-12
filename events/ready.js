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
		try {
			//Tâche de lancement
			await updateToken();
			await initRssMemory(client);
			console.log(`Prêt ! Connecté en tant que ${client.user.tag}`);
		} catch (error) {
			console.error('Erreur lors de l\'initialisation:', error);
		}

		//Tâche Cron

		//Notifie live twitch
		cron.schedule(config.cron.notifyLive, async () => {
			try {
				await notifyLive(client.channels.cache.get(config.server.channel.announcement));
			} catch (error) {
				console.error('[Cron] Erreur notifyLive:', error);
			}
		})

		//Update token twitch
		cron.schedule(config.cron.updateToken, async () => {
			try {
				await updateToken();
			} catch (error) {
				console.error('[Cron] Erreur updateToken:', error);
			}
		})

		//RSS
		cron.schedule(config.cron.getRss, async () => {
			try {
				await processRss(client);
			} catch (error) {
				console.error('[Cron] Erreur processRss:', error);
			}
		});
	},
};
