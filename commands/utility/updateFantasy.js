const { config } = require('../../config/config.js');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { fantasyUpdate } = require('../../functions/hltv/fantasyUpdate.js'); // importe ta fonction

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatefantasy')
        .setDescription("Annonce les résultats d'une fantasy !"),

    async execute(interaction) {
        const channelId = interaction.channel.id;

        // 0️⃣ Déférer la réponse pour éviter l'erreur 10062 si fantasyUpdate prend du temps
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        // 1️⃣ Trouver la fantasy du channel
        const fantasy = config.server.channel.fantasy.find(
            f => f.channel === channelId
        );

        if (!fantasy) {
            return interaction.editReply({
                content: "❌ Aucune fantasy active dans ce channel."
            });
        }

        if (!fantasy.players || fantasy.players.length === 0) {
            return interaction.editReply({
                content: "❌ Aucun joueur inscrit dans cette fantasy."
            });
        }

        // 2️⃣ Appeler fantasyUpdate pour chaque joueur
        const channelObj = interaction.client.channels.cache.get(channelId);

        for (const player of fantasy.players) {
            // fantasyUpdate(url, channel, userId)
            await fantasyUpdate(player.url, channelObj, player.id);
        }

        // 3️⃣ Confirmation
        return interaction.editReply({
            content: "✅ Mise à jour de la fantasy effectuée pour tous les joueurs !"
        });
    },
};