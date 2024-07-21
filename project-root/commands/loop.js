const { SlashCommandBuilder } = require('discord.js');
const { formatMessage } = require('../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggles loop mode for the current song or playlist.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of loop to toggle')
        .setRequired(true)
        .addChoices(
          { name: 'Song', value: 'song' },
          { name: 'Playlist', value: 'playlist' },
        ),
    ),
  async execute(interaction) {
    const loopType = interaction.options.getString('type');
    const musicPlayer = interaction.client.musicPlayer;

    if (!musicPlayer.isPlaying) {
      return interaction.reply(formatMessage('error', 'No music is currently playing.'));
    }

    if (loopType === 'song') {
      musicPlayer.loopSong = !musicPlayer.loopSong;
      musicPlayer.loopPlaylist = false;
      await interaction.reply(formatMessage('success', `Looping the current song is now ${musicPlayer.loopSong ? 'enabled' : 'disabled'}.`));
    } else if (loopType === 'playlist') {
      musicPlayer.loopPlaylist = !musicPlayer.loopPlaylist;
      musicPlayer.loopSong = false;
      await interaction.reply(formatMessage('success', `Looping the playlist is now ${musicPlayer.loopPlaylist ? 'enabled' : 'disabled'}.`));
    }
  },
};