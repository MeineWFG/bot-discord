const { config } = require('../../config/config.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const path = require('node:path');
const { getRandomElement, getRandomColor } = require('../../utils/helpers.js');

module.exports = {
    async notifyLive (announcementChannel) {
        if (!announcementChannel) {
            console.error('[Twitch] Channel d\'annonce introuvable.');
            return;
        }

        try {
            const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${config.twitch.userLogin}`, { headers: { 'Client-Id': config.twitch.clientID, 'Authorization': `Bearer ${config.twitch.token}` }});

            if (response.data.data.length === 0) return;

            const data = response.data.data[0];
            let isNewAnnoucement = false;

            if (config.twitch.startedAt !== data.started_at) {
                isNewAnnoucement = true;
                config.twitch.startedAt = data.started_at;
            }

            if (config.twitch.gameName !== data.game_name) {
                isNewAnnoucement = true;
                config.twitch.gameName = data.game_name;
            }

            if (isNewAnnoucement) {
                const randomImage = getRandomElement(config.images.stream);
                const urlThumbnail = data.thumbnail_url.replace('{width}', '1920').replace('{height}', (Math.floor(Math.random() * (1080 - 1070 + 1)) + 1070).toString());

                const embed = new EmbedBuilder()
                    .setColor(getRandomColor())
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

                await announcementChannel.send({
                    content: `** ${getRandomElement(config.server.text.stream)}   @everyone **`,
                    embeds: [embed],
                    files: [
                        path.join(__dirname, '..', '..', 'images', config.images.streamIcon),
                        path.join(__dirname, '..', '..', 'images', randomImage)
                    ]
                });
            }
        } catch (error) {
            console.error('[Twitch] Erreur notifyLive:', error.message);
        }
    }
}
