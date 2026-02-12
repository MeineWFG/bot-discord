const { config } = require('./config/config.js');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

const handlersPath = path.join(__dirname, './handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
for (const file of handlerFiles){
	const filePath = path.join(handlersPath, file);
	require(filePath)(client);
}

process.on('unhandledRejection', (error) => {
	console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception:', error);
});

client.login(config.discord.token).catch((error) => {
	console.error('Erreur lors de la connexion à Discord:', error);
	process.exit(1);
});
