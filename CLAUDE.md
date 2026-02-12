# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start the bot**: `node index.js`
- **Deploy slash commands to Discord**: `npm run deploy` (runs `node utils/deployCommands.js`)
- **No test suite configured**

## Architecture

This is a Discord bot built with **Discord.js v14** and **Node.js 20**, written in JavaScript. The bot serves a French-speaking gaming/streaming community with Discord event handling, RSS feed monitoring, and Twitch stream notifications.

### Entry Point & Initialization

`index.js` creates the Discord client (intents: Guilds, GuildMembers, GuildVoiceStates) and dynamically loads all handlers from `handlers/`. The two handlers (`command.js`, `event.js`) scan the `commands/` and `events/` directories to register modules automatically.

### Configuration

`config/config.js` holds all settings with a prod/dev toggle (`IS_PROD` boolean). It contains Discord credentials, channel/role/member IDs, cron schedules, RSS feed URLs, Twitch API credentials, and feature flags. Sensitive values are hardcoded here (not in env vars).

### Command Pattern

Slash commands live in `commands/<category>/`. Each exports `data` (SlashCommandBuilder) and an `execute(interaction)` function. Commands are loaded into `client.commands` Collection by the command handler.

### Event Pattern

Events in `events/` export `name`, `once` (boolean), and `execute()`. The event handler registers them with `client.on()` or `client.once()`.

### Background Tasks (Cron)

The `ready` event initializes three cron-scheduled tasks:
- **RSS feeds** (`functions/rss/`): Every 15 minutes, fetches HLTV and WowHead RSS feeds via CORS proxies (AllOrigins, CorsProxy), tracks posted URLs in-memory arrays, and posts new articles as embeds.
- **Twitch live notifications** (`functions/twitch/notifyLive.js`): Every 5 seconds, checks stream status via Twitch API and posts/updates notification embeds.
- **Twitch token refresh** (`functions/twitch/updateToken.js`): Every 30 minutes, refreshes the OAuth2 client credentials token.

### RSS Memory

RSS deduplication uses in-memory arrays (`arrayNews` in config). On startup, `initRssMemory.js` pre-populates these arrays by scanning recent messages in RSS channels, so articles aren't reposted after a restart.

### Key Dependencies

- `discord.js` — Discord API client
- `node-cron` — Task scheduling
- `axios` — HTTP requests (Twitch API, RSS with proxy)
- `rss-parser` — RSS/XML parsing with custom fields
- `date-fns` — Date formatting (French locale)
- `puppeteer` — Installed but currently unused

## Language

All user-facing text (embeds, messages) and most code comments are in **French**.

## Deployment

Dockerfile uses `node:20-alpine` with Chromium installed (for puppeteer). The bot runs as `node index.js` in the container.
