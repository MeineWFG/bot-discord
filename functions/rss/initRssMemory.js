const { config } = require('../../config/config.js');
const { normalizeUrl } = require('./processRss.js');

async function initRssMemory(client) {
    const rssTypes = Object.keys(config.server.rss);

    for (const type of rssTypes) {
        const channelId = config.server.channel[type];
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            console.error(`[RSS] Channel introuvable pour ${type}`);
            continue;
        }

        try {
            const messages = await channel.messages.fetch({ limit: 100 });

            for (const msg of messages.values()) {
                for (const embed of msg.embeds) {
                    if (!embed.url) continue;
                    config.server.rss[type].arrayNews.add(normalizeUrl(embed.url));
                }
            }
        } catch (err) {
            console.error(`[RSS] Erreur init ${type} : ${err.message}`);
        }
    }
}

module.exports = { initRssMemory };
