const axios = require('axios');
const { Colors, EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const fs = require('fs');
const { imagesJSON, serverJSON, twitchJSON } = require('../../json/config.json');

module.exports = {
    async notifyLive (announcementChannel) {
        //Lecture du fichier config.json
        var configJSON = JSON.parse(fs.readFileSync('./json/config.json'));

        //Récupération de la clé API twitch
        axios.get(`https://api.twitch.tv/helix/streams?user_login=${twitchJSON.userLogin}`, { headers: { 'Client-Id': twitchJSON.clientID, 'Authorization': `Bearer ${configJSON.twitchJSON.token}` }})
        .then((response) => {
            if(response.data.data.length == 0) return;
            
            const data = response.data.data[0];
            var isNewAnnoucement = false;

            if(configJSON.twitchJSON.startedAt != data.started_at){
                isNewAnnoucement = true;
                configJSON.twitchJSON.startedAt = data.started_at;
            }

            if(configJSON.twitchJSON.gameName != data.game_name){
                isNewAnnoucement = true;
                configJSON.twitchJSON.gameName = data.game_name;
            }

            if(isNewAnnoucement){
                //Réecriture du fichier config.json avec format
                fs.writeFileSync('./json/config.json', JSON.stringify(configJSON, null, 2));
                
                const randomImage = imagesJSON.stream[Math.floor(Math.random() * imagesJSON.stream.length)];
                const urlThumbnail = data.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080');

                const embed = new EmbedBuilder()
                    .setColor(Colors[Object.keys(Colors)[Math.floor(Math.random() * Object.keys(Colors).length)]])
                    .setTitle(data.title)
                    .setURL('https://www.twitch.tv/' + data.user_login)
                    .setAuthor({ name: data.user_name + ' est en direct !', iconURL: `attachment://${imagesJSON.stream_icon}`})
                    .setThumbnail(`attachment://${randomImage}`)
                    .setImage(urlThumbnail)
                    .setDescription(':arrow_forward: https://www.twitch.tv/' + data.user_login)
                    .addFields(
                        { name: 'Joue à : ', value: data.game_name, inline: true},
                        { name: 'Date : ', value: format(new Date(), "EEEE, dd MMMM yyyy", { locale: fr }), inline: true}
                    )
                    .setTimestamp()

                announcementChannel.send({ 
                    content: `** ${serverJSON.text.stream[Math.floor(Math.random() * serverJSON.text.stream.length)]}   @everyone **`, 
                    embeds: [embed], 
                    files: [
                        `./images/${imagesJSON.stream_icon}`, 
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