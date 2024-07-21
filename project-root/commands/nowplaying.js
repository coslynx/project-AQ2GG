const { SlashCommandBuilder } = require('discord.js');
const { formatMessage } = require('../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Displays information about the currently playing song.'),
  async execute(interaction) {
    const musicPlayer = interaction.client.musicPlayer;

    if (!musicPlayer.currentSong) {
      await interaction.reply(formatMessage('There is no song currently playing.', 'RED'));
      return;
    }

    const currentSong = musicPlayer.currentSong;
    const songInfo = `Now Playing: **${currentSong.title}** by **${currentSong.artist}** (${currentSong.duration})`;

    await interaction.reply(formatMessage(songInfo, 'GREEN'));
  },
};