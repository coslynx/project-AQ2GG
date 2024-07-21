const { SlashCommandBuilder } = require('discord.js');
const { createPlaylist } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist-create')
    .setDescription('Creates a new playlist.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the playlist to create')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('name');

    try {
      await createPlaylist(playlistName);
      await interaction.reply(`Playlist "${playlistName}" created successfully!`);
    } catch (error) {
      console.error('Error creating playlist:', error);
      await interaction.reply(
        `Failed to create playlist "${playlistName}". Please try again later.`
      );
    }
  },
};