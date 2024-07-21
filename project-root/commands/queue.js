const { SlashCommandBuilder } = require('discord.js');
const { formatQueue } = require('../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current song queue'),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There are no songs in the queue.', ephemeral: true });
    }

    const formattedQueue = formatQueue(queue);
    if (formattedQueue) {
      await interaction.reply({ content: formattedQueue, ephemeral: true });
    } else {
      await interaction.reply({ content: 'There are no songs in the queue.', ephemeral: true });
    }
  },
};