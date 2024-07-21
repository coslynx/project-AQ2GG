const { SlashCommandBuilder } = require('discord.js');
const { prefix } = require('../config.json');
const { formatMessage } = require('../utils/helper.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List of available commands.'),
  async execute(interaction) {
    const commands = [
      { name: '!play', description: 'Play a song from YouTube, SoundCloud, or a local file.' },
      { name: '!queue', description: 'Display the current song queue.' },
      { name: '!skip', description: 'Skip to the next song in the queue.' },
      { name: '!stop', description: 'Stop the music playback.' },
      { name: '!volume [number]', description: 'Adjust the volume (0-1).' },
      { name: '!loop', description: 'Toggle loop mode for the current song or playlist.' },
      { name: '!nowplaying', description: 'Display information about the currently playing song.' },
      { name: '!playlist create [playlist name]', description: 'Create a new playlist.' },
      { name: '!playlist load [playlist name]', description: 'Load a playlist.' },
      { name: '!playlist save [playlist name]', description: 'Save the current queue as a playlist.' },
      { name: '!search [query]', description: 'Search for songs on YouTube and SoundCloud.' },
      { name: '!help', description: 'Display this help message.' },
    ];

    const helpMessage = `**Available Commands:**\n\n${commands.map(command => `**${prefix}${command.name}**: ${command.description}`).join('\n')}`;

    await interaction.reply(formatMessage(helpMessage));
  },
};