const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const { token, prefix, defaultVolume, databaseFile, youtubeApiKey, soundcloudClientId } = require('./config.json');
const { MusicPlayer } = require('./utils/music');
const { DatabaseManager } = require('./utils/database');
const { Helper } = require('./utils/helper');
const chalk = require('chalk');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const musicPlayer = new MusicPlayer(defaultVolume);
const database = new DatabaseManager(databaseFile);
const helper = new Helper(prefix);

// Load commands
const commands = {};
const commandFiles = ['play', 'queue', 'skip', 'stop', 'volume', 'loop', 'nowplaying', 'search', 'help', 'playlist'];
commandFiles.forEach(commandFile => {
  const command = require(`./commands/${commandFile}`);
  commands[command.name] = command;
});

client.on('ready', () => {
  console.log(chalk.green(`Logged in as ${client.user.tag}!`));
  client.user.setActivity('Music', { type: 'LISTENING' });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commands[commandName]) {
    try {
      const commandHandler = commands[commandName].handleCommand;
      await commandHandler(message, args, musicPlayer, database, helper);
    } catch (error) {
      console.error(chalk.red(`Error executing command: ${commandName}`), error);
      message.reply('An error occurred while executing this command.');
    }
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.member.user.bot) return;
  if (oldState.channelId && !newState.channelId) {
    // User left a voice channel
    if (newState.member.id === client.user.id) {
      // Bot was disconnected
      musicPlayer.stopPlayback();
      musicPlayer.clearQueue();
      console.log(chalk.yellow(`Bot left voice channel ${oldState.channelId}.`));
    }
  } else if (!oldState.channelId && newState.channelId) {
    // User joined a voice channel
    if (newState.member.id === client.user.id) {
      // Bot joined a voice channel
      console.log(chalk.yellow(`Bot joined voice channel ${newState.channelId}.`));
    }
  }
});

client.login(token);