const { config } = require('../config/config.js');
const { Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState) {

        if(config.flagFeature.bibooMove == "true"){
            //Move mute
            if(newState.member.id == config.server.member.biboo && (((oldState.deaf == true && newState.deaf == true && oldState.streaming == true && newState.streaming == false)) || (newState.streaming == false && oldState.deaf == false && newState.deaf == true))){
                newState.member.voice.setChannel(config.server.channel.bibooMuted)

                //Actualisation du channel muted
                config.server.channel.bibooBeforeMuted = newState.channelId;
            }

            //Retour dans le channel
            if(newState.member.id == config.server.member.biboo && newState.channelId == config.server.channel.bibooMuted && newState.streaming == false && oldState.deaf == true && newState.deaf == false){
                newState.member.voice.setChannel(config.server.channel.bibooBeforeMuted)
            }
        }
	},
};