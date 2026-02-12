const { config } = require('../config/config.js');
const { Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState) {
		if (config.flagFeature.bibooMove !== true) return;
		if (newState.member.id !== config.server.member.biboo) return;

		try {
			const wasDeaf = oldState.deaf === true;
			const isDeaf = newState.deaf === true;
			const wasStreaming = oldState.streaming === true;
			const isStreaming = newState.streaming === true;
			const isInMutedChannel = newState.channelId === config.server.channel.bibooMuted;

			//Move mute
			const stoppedStreamWhileDeaf = wasDeaf && isDeaf && wasStreaming && !isStreaming;
			const justDeafened = !wasDeaf && isDeaf && !isStreaming;

			if (stoppedStreamWhileDeaf || justDeafened) {
				config.server.channel.bibooBeforeMuted = newState.channelId;
				await newState.member.voice.setChannel(config.server.channel.bibooMuted);
			}

			//Retour dans le channel
			if (isInMutedChannel && !isStreaming && wasDeaf && !isDeaf) {
				await newState.member.voice.setChannel(config.server.channel.bibooBeforeMuted);
			}
		} catch (error) {
			console.error('[VoiceStateUpdate] Erreur:', error);
		}
	},
};
