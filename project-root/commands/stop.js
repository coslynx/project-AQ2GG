const { SlashCommandBuilder } = require('discord.js');
const {  prism } = require('prism-media');
const { formatMessage } = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the current music playback and clears the queue.'),
  async execute(interaction) {
    const { musicPlayer } = interaction.client;

    if (!interaction.member.voice.channel) {
      return interaction.reply(formatMessage('You must be in a voice channel to use this command.', 'error'));
    }

    if (!musicPlayer.isPlaying) {
      return interaction.reply(formatMessage('No music is currently playing.', 'info'));
    }

    musicPlayer.stopPlayback();
    musicPlayer.queue.length = 0; // Clear the queue

    await interaction.reply(formatMessage('Music playback stopped.', 'success'));

    // Leave the voice channel if the queue is empty
    if (musicPlayer.queue.length === 0) {
      musicPlayer.leaveVoiceChannel();
    }
  },
};