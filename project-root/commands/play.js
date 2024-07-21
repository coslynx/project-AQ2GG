const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader');
const fetch = require('node-fetch');
const prism = require('prism-media');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { queue, isPlaying, currentSong } = require('../utils/music');
const { formatMessage } = require('../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube, SoundCloud, or a local file.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('The song to play.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const songUrl = interaction.options.getString('song');

    const song = await getSong(songUrl);

    if (!song) {
      return interaction.reply({ content: formatMessage('error', 'Invalid song URL or file path.') });
    }

    addToQueue(song);

    if (!isPlaying) {
      startPlayback(interaction);
    } else {
      interaction.reply({ content: formatMessage('info', `Added ${song.title} to the queue.`) });
    }
  },
};

async function getSong(songUrl) {
  // Check if the URL is a YouTube video URL
  if (ytdl.validateURL(songUrl)) {
    try {
      const info = await ytdl.getInfo(songUrl);
      return {
        title: info.videoDetails.title,
        url: songUrl,
        source: 'youtube',
        duration: info.videoDetails.lengthSeconds,
        thumbnail: info.videoDetails.thumbnails[0].url,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Check if the URL is a SoundCloud track URL
  if (scdl.validateURL(songUrl)) {
    try {
      const info = await scdl.getInfo(songUrl);
      return {
        title: info.title,
        url: songUrl,
        source: 'soundcloud',
        duration: info.duration / 1000,
        thumbnail: info.artwork_url,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Check if the URL is a local file path
  if (songUrl.startsWith('file://')) {
    try {
      const stats = await fs.promises.stat(songUrl.replace('file://', ''));
      if (stats.isFile()) {
        return {
          title: path.basename(songUrl.replace('file://', '')),
          url: songUrl,
          source: 'local',
          duration: 0,
          thumbnail: '',
        };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return null;
}

function addToQueue(song) {
  queue.push(song);
}

async function startPlayback(interaction) {
  const player = createAudioPlayer();

  const connection = joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const song = queue[0];
  let resource;

  switch (song.source) {
    case 'youtube':
      resource = createAudioResource(ytdl(song.url, { filter: 'audioonly' }), { inlineVolume: true });
      break;
    case 'soundcloud':
      const stream = await scdl.download(song.url);
      resource = createAudioResource(stream, { inlineVolume: true });
      break;
    case 'local':
      resource = createAudioResource(fs.createReadStream(song.url.replace('file://', '')), { inlineVolume: true });
      break;
    default:
      return interaction.reply({ content: formatMessage('error', 'Invalid song source.') });
  }

  player.play(resource);

  currentSong = song;
  isPlaying = true;

  connection.subscribe(player);

  interaction.reply({ content: formatMessage('info', `Now playing: ${song.title}`) });

  player.on('finish', () => {
    queue.shift();
    if (queue.length > 0) {
      startPlayback(interaction);
    } else {
      isPlaying = false;
      currentSong = null;
    }
  });
}