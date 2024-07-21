const { SlashCommandBuilder } = require('discord.js');
const {  MusicPlayer } = require('../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjusts the volume of the music playback.')
    .addNumberOption(option => 
      option
        .setName('volume')
        .setDescription('The desired volume level (0-1).')
        .setRequired(true)
    ),
  async execute(interaction) {
    const volume = interaction.options.getNumber('volume');

    // Validate the volume input
    if (volume < 0 || volume > 1) {
      return interaction.reply({ content: 'Invalid volume level. Please enter a number between 0 and 1.', ephemeral: true });
    }

    // Set the volume using the MusicPlayer instance
    const musicPlayer = new MusicPlayer();
    musicPlayer.setVolume(volume);

    await interaction.reply({ content: `Volume set to ${volume * 100}%`, ephemeral: true });
  },
};