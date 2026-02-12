const { config } = require('../../config/config.js');
const axios = require('axios');

module.exports = {
    /**
     * Récupération et actualisation de la clé Twitch API
     */
    async updateToken () {
        try {
            const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${config.twitch.clientID}&client_secret=${config.twitch.clientSecret}&grant_type=client_credentials`);
            config.twitch.token = response.data.access_token;
        } catch (error) {
            console.error('[Twitch] Erreur updateToken:', error.message);
        }
    }
}
