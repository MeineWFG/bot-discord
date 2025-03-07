const { botJSON } = require('./json/config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

const handlersPath = path.join(__dirname, './handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
for (const file of handlerFiles){
	const filePath = path.join(handlersPath, file);
	require(filePath) (client);
}

client.login(botJSON.token);