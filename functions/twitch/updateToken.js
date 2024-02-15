const axios = require('axios');
const fs = require('fs');
const { twitchJSON } = require('../../json/config.json');

module.exports = {
    /**
     * Récupération et actualisation de la clé Twitch API
     */
    async updateToken () {
        //Récupération de la clé API twitch
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${twitchJSON.clientID}&client_secret=${twitchJSON.clientSecret}&grant_type=client_credentials`)
        .then((response) => {
            //Lecture du fichier config.json
            var configJSON = JSON.parse(fs.readFileSync('./json/config.json'));
    
            //Actualisation de la clé Twitch API dans le fichier config.json
            configJSON.twitchJSON.token = response.data.access_token;
    
            //Réecriture du fichier config.json avec format
            fs.writeFileSync('./json/config.json', JSON.stringify(configJSON, null, 2));
        })
        .catch(function (error){
            console.log(error);
        })
    }
}