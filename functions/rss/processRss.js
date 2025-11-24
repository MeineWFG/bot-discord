const { config } = require('../../config/config.js');
const { Colors, EmbedBuilder } = require('discord.js');
const Parser = require('rss-parser');
const lastError = {};

module.exports = {
    async processRss(client) {
        try {
            let parser = new Parser({ 
                requestOptions: {
                     headers: { 
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36", 
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", 
                        "Accept-Language": "en-US,en;q=0.9", 
                    } 
                }, 
                customFields: { 
                    item: ['media:content'] 
                } 
            });

            for (const rssKey of Object.keys(config.server.rss)) {
                const rss = config.server.rss[rssKey];

                const channel = client.channels.cache.get(config.server.channel[rssKey]);
                if (!channel) {
                    console.error(`Channel introuvable pour RSS: ${rssKey}`);
                    continue;
                }

                const feed = await parser.parseURL(rss.lien);
                lastError[rssKey] = null;

                for (const item of feed.items.slice().reverse()) {
                    if (!rss.arrayNews.includes(item.link)) {

                        if (rss.arrayNews.length > 100) {
                            rss.arrayNews.pop();
                            rss.arrayNews.unshift(item.link);
                        } else {
                            rss.arrayNews.push(item.link);
                        }

                        const embed = new EmbedBuilder()
                            .setColor(
                                Colors[
                                    Object.keys(Colors)[
                                        Math.floor(Math.random() * Object.keys(Colors).length)
                                    ]
                                ]
                            )
                            .setTitle(item.title)
                            .setURL(item.link)
                            .setImage(item["media:content"]?.$.url || rss.image)
                            .setDescription(item["contentSnippet"] || item.content)
                            .setTimestamp();

                        await channel.send({ embeds: [embed] });
                    }
                }
            }

        } catch (err) {
            const msg = `Erreur lors de la récupération du flux RSS : ${err.message}`;
            console.error(msg);
            return null;
        }
    }
};