const { SlashCommandBuilder } = require('discord.js');
const { loadPlaylist } = require('../../utils/database');
const { formatMessage } = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist-load')
    .setDescription('Loads a saved playlist.')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The name of the playlist to load')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('name');

    try {
      const playlist = await loadPlaylist(playlistName);

      if (!playlist) {
        await interaction.reply(formatMessage('error', `Playlist "${playlistName}" not found.`));
        return;
      }

      // Add songs from the playlist to the queue
      playlist.songs.forEach(song => interaction.client.musicPlayer.queueSong(song));

      // Start playing the first song in the queue if not already playing
      if (!interaction.client.musicPlayer.isPlaying) {
        interaction.client.musicPlayer.playNextSong();
      }

      await interaction.reply(formatMessage('success', `Playlist "${playlistName}" loaded successfully.`));
    } catch (error) {
      console.error(`Error loading playlist: ${error}`);
      await interaction.reply(formatMessage('error', 'An error occurred while loading the playlist.'));
    }
  },
};