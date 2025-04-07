const { Colors, EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const fs = require('fs');
const Parser = require('rss-parser');
const { serverJSON } = require('../../json/config.json');

module.exports = {
    async getRss (channelHltv) {
        let parser = new Parser({
            customFields: {
              item: ['media:content'],
            }
        });
        
        let feed = await parser.parseURL(serverJSON.rss.hltv);
        feed.items.slice().reverse().forEach(item => {
            //Lecture du fichier config.json
            var configJSON = JSON.parse(fs.readFileSync('./json/config.json'));
            
            let newsArray = JSON.parse(configJSON.serverJSON.hltv.news);

            if(!newsArray.includes(item.guid)) {
                if(newsArray.length > 100) {
                    newsArray.pop();
                    newsArray.unshift(item.guid);
                } else {
                    newsArray.push(item.guid);
                }

                const embed = new EmbedBuilder()
                    .setColor(Colors[Object.keys(Colors)[Math.floor(Math.random() * Object.keys(Colors).length)]])
                    .setTitle(item.title)
                    .setURL(item.link)
                    .setAuthor({ name: "HLTV.org" })
                    .setImage(item["media:content"].$.url || "https://www.hltv.org/img/static/openGraphHltvLogo.png")
                    .setDescription(item.content)
                    .setTimestamp()
                channelHltv.send({ 
                    content: ``, 
                    embeds: [embed]
                })
            }

            //Actualisation hltv news
            configJSON.serverJSON.hltv.news = JSON.stringify(newsArray);
    
            //Réecriture du fichier config.json avec format
            fs.writeFileSync('./json/config.json', JSON.stringify(configJSON, null, 2));
        });
    }
}