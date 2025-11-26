const { config } = require('../../config/config.js');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registertofantasy')
        .setDescription("S'enregistrer dans la fantasy !")
        .addStringOption(option =>
            option.setName('url')
                .setDescription("L'URL de votre équipe Fantasy")
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription("Optionnel : enregistrer un autre utilisateur")
                .setRequired(false)
        ),

    async execute(interaction) {

        const channelId = interaction.channel.id;

        // 1️⃣ Trouver la fantasy correspondant au salon
        const fantasy = config.server.channel.fantasy.find(
            f => f.channel === channelId
        );

        if (!fantasy) {
            return interaction.reply({
                content: "❌ Il n'y a **aucune fantasy active dans ce channel**.",
                flags: MessageFlags.Ephemeral
            });
        }

        // 2️⃣ URL
        const url = interaction.options.getString('url');
        if (!url.startsWith('http')) {
            return interaction.reply({
                content: "❌ L'URL fournie n'est **pas valide**.",
                flags: MessageFlags.Ephemeral
            });
        }

        // 3️⃣ Déterminer l'ID du joueur
        const user = interaction.options.getUser('utilisateur') || interaction.user;
        const userId = user.id;

        // 4️⃣ Vérifier si le joueur est déjà inscrit
        const existingPlayer = fantasy.players.find(p => p.id === userId);

        if (existingPlayer) {
            return interaction.reply({
                content: `❌ ${userId === interaction.user.id ? "Vous êtes" : "Cet utilisateur est"} **déjà inscrit** à la fantasy de ce salon.`,
                flags: MessageFlags.Ephemeral
            });
        }

        // 5️⃣ Enregistrer le joueur dans CETTE fantasy
        fantasy.players.push({
            id: userId,
            url: url
        });

        // 6️⃣ Confirmation
        return interaction.reply({
            content: `✅ ${userId === interaction.user.id ? "Vous êtes" : `${user.username} est`} maintenant **inscrit à la fantasy de ce channel**.`,
            flags: MessageFlags.Ephemeral
        });
    },
};