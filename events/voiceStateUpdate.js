const { Colors, Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const { imagesJSON, serverJSON } = require('../json/config.json');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState) {
        //Lecture du fichier config.json
        var configJSON = JSON.parse(fs.readFileSync('./json/config.json'));

        if(configJSON.flagFeature.bibooMove == "true"){
            //Move mute
            if(newState.member.id == configJSON.serverJSON.member.biboo && (((oldState.deaf == true && newState.deaf == true && oldState.streaming == true && newState.streaming == false)) || (newState.streaming == false && oldState.deaf == false && newState.deaf == true))){
                newState.member.voice.setChannel(configJSON.serverJSON.channel.bibooMuted)

                //Actualisation du channel muted
                configJSON.serverJSON.channel.bibooBeforeMuted = newState.channelId;

                //Réecriture du fichier config.json avec format
                fs.writeFileSync('./json/config.json', JSON.stringify(configJSON, null, 2));
            }

            //Retour dans le channel
            if(newState.member.id == configJSON.serverJSON.member.biboo && newState.channelId == configJSON.serverJSON.channel.bibooMuted && newState.streaming == false && oldState.deaf == true && newState.deaf == false){
                newState.member.voice.setChannel(configJSON.serverJSON.channel.bibooBeforeMuted)
            }
        }
	},
};