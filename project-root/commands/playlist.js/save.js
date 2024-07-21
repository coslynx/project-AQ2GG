const { SlashCommandBuilder } = require('discord.js');
const { database } = require('../../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist save')
    .setDescription('Saves the current queue as a playlist')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the playlist')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('name');

    try {
      // Get the current queue from the music player
      const queue = interaction.client.player.getQueue(interaction.guild.id);
      if (!queue) {
        return interaction.reply({ content: 'There is no queue to save!', ephemeral: true });
      }

      // Extract song information from the queue
      const songs = queue.tracks.map(track => ({
        title: track.title,
        artist: track.author,
        url: track.url
      }));

      // Save the playlist to the database
      await database.savePlaylist(interaction.guild.id, playlistName, songs);

      await interaction.reply({ content: `Playlist **${playlistName}** saved successfully!` });
    } catch (error) {
      console.error('Error saving playlist:', error);
      await interaction.reply({ content: 'An error occurred while saving the playlist.', ephemeral: true });
    }
  }
};