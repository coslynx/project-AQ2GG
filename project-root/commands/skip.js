const { SlashCommandBuilder } = require('discord.js');
const { musicPlayer } = require('../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  async execute(interaction) {
    if (!musicPlayer.isPlaying) {
      return interaction.reply({ content: 'There is no song currently playing!', ephemeral: true });
    }

    const queue = musicPlayer.queue;

    if (queue.length === 0) {
      await musicPlayer.stopPlayback();
      return interaction.reply({ content: 'The queue is empty. Stopping playback.' });
    }

    await musicPlayer.playNextSong();
    return interaction.reply({ content: 'Skipped to the next song!' });
  },
};