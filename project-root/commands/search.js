const { SlashCommandBuilder } = require('discord.js');
const { searchYouTube, searchSoundCloud } = require('../utils/music');
const { formatMessage } = require('../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a song on YouTube or SoundCloud.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The song or artist to search for.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');

    // Search YouTube
    const youtubeResults = await searchYouTube(query);
    const youtubeResultMessage = youtubeResults.length
      ? `**YouTube Results:**\n${youtubeResults.map((result, index) => `${index + 1}. ${result.title} - ${result.channel}`).join('\n')}`
      : 'No results found on YouTube.';

    // Search SoundCloud
    const soundcloudResults = await searchSoundCloud(query);
    const soundcloudResultMessage = soundcloudResults.length
      ? `**SoundCloud Results:**\n${soundcloudResults.map((result, index) => `${index + 1}. ${result.title} - ${result.user.username}`).join('\n')}`
      : 'No results found on SoundCloud.';

    // Send the search results to the user
    await interaction.reply(formatMessage(youtubeResultMessage + '\n\n' + soundcloudResultMessage));
  },
};