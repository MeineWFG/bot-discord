const { config } = require('../../config/config.js');
const axios = require('axios');
const { Colors, EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');

module.exports = {
    async notifyLive (announcementChannel) {

        //Récupération de la clé API twitch
        axios.get(`https://api.twitch.tv/helix/streams?user_login=${config.twitch.userLogin}`, { headers: { 'Client-Id': config.twitch.clientID, 'Authorization': `Bearer ${config.twitch.token}` }})
        .then((response) => {
            if(response.data.data.length == 0) return;
            
            const data = response.data.data[0];
            var isNewAnnoucement = false;

            if(config.twitch.startedAt != data.started_at){
                isNewAnnoucement = true;
                config.twitch.startedAt = data.started_at;
            }

            if(config.twitch.gameName != data.game_name){
                isNewAnnoucement = true;
                config.twitch.gameName = data.game_name;
            }

            if(isNewAnnoucement){
                const randomImage = config.images.stream[Math.floor(Math.random() * config.images.stream.length)];
                const urlThumbnail = data.thumbnail_url.replace('{width}', '1920').replace('{height}', (Math.floor(Math.random() * (1080 - 1070 + 1)) + 1070).toString());

                const embed = new EmbedBuilder()
                    .setColor(Colors[Object.keys(Colors)[Math.floor(Math.random() * Object.keys(Colors).length)]])
                    .setTitle(data.title)
                    .setURL('https://www.twitch.tv/' + data.user_login)
                    .setAuthor({ name: data.user_name + ' est en direct !', iconURL: `attachment://${config.images.streamIcon}`})
                    .setThumbnail(`attachment://${randomImage}`)
                    .setImage(urlThumbnail)
                    .setDescription(':arrow_forward: https://www.twitch.tv/' + data.user_login)
                    .addFields(
                        { name: 'Joue à : ', value: data.game_name, inline: true},
                        { name: 'Date : ', value: format(new Date(), "EEEE, dd MMMM yyyy", { locale: fr }), inline: true}
                    )
                    .setTimestamp()

                announcementChannel.send({ 
                    content: `** ${config.server.text.stream[Math.floor(Math.random() * config.server.text.stream.length)]}   @everyone **`, 
                    embeds: [embed], 
                    files: [
                        `./images/${config.images.streamIcon}`, 
                        `./images/${randomImage}`
                    ] 
                })
            }
        })
        .catch(function (error){
            console.log(error);
        })
    }
}