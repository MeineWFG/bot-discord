const { config } = require('../../config/config.js');
const { EmbedBuilder } = require('discord.js');
const Parser = require('rss-parser');
const axios = require('axios');
const { getRandomColor } = require('../../utils/helpers.js');

module.exports = {
    async processRss(client) {
        const parser = new Parser({
            customFields: {
                item: ['media:content', 'description']
            }
        });

        for (const rssKey of Object.keys(config.server.rss)) {
            try {
                const rss = config.server.rss[rssKey];

                const channel = client.channels.cache.get(config.server.channel[rssKey]);
                if (!channel) {
                    console.error(`❌ Channel introuvable pour RSS: ${rssKey}`);
                    continue;
                }

                let feed;

                // Stratégie spéciale pour HLTV
                if (rssKey === 'hltv' || rss.lien.includes('hltv.org')) {
                    try {
                        // Méthode 1: Essayer avec AllOrigins (alternative à RSS2JSON)
                        const allOriginsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rss.lien)}`;

                        const response = await axios.get(allOriginsUrl, {
                            timeout: 15000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        feed = await parser.parseString(response.data);

                    } catch (allOriginsError) {
                        console.warn(`⚠️ AllOrigins échoué: ${allOriginsError.message}`);

                        try {
                            // Méthode 2: Essayer avec CORS-Anywhere
                            const corsUrl = `https://corsproxy.io/?${encodeURIComponent(rss.lien)}`;

                            const response = await axios.get(corsUrl, {
                                timeout: 15000,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                }
                            });

                            feed = await parser.parseString(response.data);

                        } catch (corsError) {
                            console.warn(`⚠️ CorsProxy échoué: ${corsError.message}`);

                            // Méthode 3: Essayer directement avec headers agressifs
                            const response = await axios.get(rss.lien, {
                                headers: {
                                    "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
                                    "Accept": "application/rss+xml, application/xml, text/xml, */*",
                                    "Accept-Language": "en-US,en;q=0.9",
                                },
                                timeout: 15000,
                                maxRedirects: 5
                            });

                            feed = await parser.parseString(response.data);
                        }
                    }

                } else {
                    // Méthode standard pour les autres flux
                    const response = await axios.get(rss.lien, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                            "Accept": "application/rss+xml, application/xml, text/xml, */*",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Referer": "https://www.google.com/"
                        },
                        timeout: 10000,
                        maxRedirects: 5
                    });

                    feed = await parser.parseString(response.data);
                }

                if (!feed || !feed.items) continue;

                // Traitement des articles (du plus ancien au plus récent)
                for (const item of feed.items.slice().reverse()) {
                    if (!rss.arrayNews.has(item.link)) {

                        if (rss.arrayNews.size >= 100) {
                            const firstValue = rss.arrayNews.values().next().value;
                            rss.arrayNews.delete(firstValue);
                        }
                        rss.arrayNews.add(item.link);

                        let description = item.contentSnippet || item.content || item.description || 'Aucune description disponible';
                        // Nettoyer les balises HTML
                        description = description.replace(/<[^>]*>/g, '');
                        if (description.length > 4096) {
                            description = description.substring(0, 4093) + '...';
                        }

                        let imageUrl = rss.image;
                        if (item["media:content"]?.$.url) {
                            imageUrl = item["media:content"].$.url;
                        } else if (item.enclosure?.url) {
                            imageUrl = item.enclosure.url;
                        } else if (item.thumbnail) {
                            imageUrl = item.thumbnail;
                        }

                        const embed = new EmbedBuilder()
                            .setColor(getRandomColor())
                            .setTitle(item.title.length > 256 ? item.title.substring(0, 253) + '...' : item.title)
                            .setURL(item.link)
                            .setDescription(description)
                            .setTimestamp(item.pubDate ? new Date(item.pubDate) : new Date());

                        if (imageUrl) {
                            embed.setImage(imageUrl);
                        }

                        if (item.creator || item.author) {
                            embed.setFooter({ text: `Par ${item.creator || item.author}` });
                        }

                        await channel.send({ embeds: [embed] });
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (err) {
                console.error(`❌ Erreur sur ${rssKey}: ${err.message}`);
                continue;
            }
        }
    }
};
