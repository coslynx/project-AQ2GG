const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader');
const { Prism } = require('prism-media');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class MusicPlayer {
  constructor() {
    this.queue = [];
    this.currentSong = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.dispatcher = null;
    this.voiceConnection = null;
  }

  addToQueue(song) {
    this.queue.push(song);
    console.log(chalk.green(`[MUSIC] Added ${song.title} to the queue.`));
  }

  removeFromQueue(index) {
    if (index >= 0 && index < this.queue.length) {
      const removedSong = this.queue.splice(index, 1)[0];
      console.log(chalk.green(`[MUSIC] Removed ${removedSong.title} from the queue.`));
    }
  }

  playNextSong() {
    if (this.queue.length > 0) {
      this.currentSong = this.queue.shift();
      this.playMusic(this.currentSong);
    } else {
      this.isPlaying = false;
      this.currentSong = null;
      this.dispatcher = null;
      console.log(chalk.yellow(`[MUSIC] Queue is empty. Stopping playback.`));
    }
  }

  stopPlayback() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.currentSong = null;
      if (this.dispatcher) {
        this.dispatcher.destroy();
        this.dispatcher = null;
        console.log(chalk.green(`[MUSIC] Playback stopped.`));
      }
    }
  }

  setVolume(volume) {
    if (this.dispatcher) {
      this.volume = volume;
      this.dispatcher.setVolumeLogarithmic(volume);
      console.log(chalk.green(`[MUSIC] Volume set to ${volume * 100}%`));
    } else {
      console.log(chalk.yellow(`[MUSIC] No song is currently playing. Unable to set volume.`));
    }
  }

  getSongDuration(song) {
    if (song.source === 'youtube') {
      return ytdl.getInfo(song.url).then(info => info.videoDetails.lengthSeconds);
    } else if (song.source === 'soundcloud') {
      return scdl.getInfo(song.url).then(info => info.duration);
    } else if (song.source === 'local') {
      const stat = fs.statSync(song.path);
      return stat.size / 1000; // Approximate duration based on file size
    } else {
      return Promise.reject(new Error(`Unsupported music source: ${song.source}`));
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  playLocalFile(filePath) {
    return new Promise((resolve, reject) => {
      const audioStream = fs.createReadStream(filePath);
      const audioResource = new Prism.AudioResource(audioStream, {
        inputType: Prism.InputType.Vorbis,
        inlineVolume: true
      });
      audioResource.volume.setVolume(this.volume);
      this.dispatcher = this.voiceConnection.play(audioResource);
      this.isPlaying = true;
      this.dispatcher.on('finish', () => {
        console.log(chalk.green(`[MUSIC] Local file finished playing.`));
        this.playNextSong();
        resolve();
      });
      this.dispatcher.on('error', (error) => {
        reject(error);
      });
    });
  }

  async playMusic(song) {
    try {
      if (song.source === 'youtube') {
        const stream = ytdl(song.url, { filter: 'audioonly' });
        const audioResource = new Prism.AudioResource(stream, {
          inputType: Prism.InputType.Opus,
          inlineVolume: true
        });
        audioResource.volume.setVolume(this.volume);
        this.dispatcher = this.voiceConnection.play(audioResource);
        this.isPlaying = true;
        console.log(chalk.green(`[MUSIC] Playing ${song.title} from YouTube.`));
        this.dispatcher.on('finish', () => {
          console.log(chalk.green(`[MUSIC] YouTube song finished playing.`));
          this.playNextSong();
        });
        this.dispatcher.on('error', (error) => {
          console.error(chalk.red(`[MUSIC] Error playing YouTube song: ${error}`));
          this.playNextSong();
        });
      } else if (song.source === 'soundcloud') {
        const stream = scdl.download(song.url, { format: 'mp3' });
        const audioResource = new Prism.AudioResource(stream, {
          inputType: Prism.InputType.Vorbis,
          inlineVolume: true
        });
        audioResource.volume.setVolume(this.volume);
        this.dispatcher = this.voiceConnection.play(audioResource);
        this.isPlaying = true;
        console.log(chalk.green(`[MUSIC] Playing ${song.title} from SoundCloud.`));
        this.dispatcher.on('finish', () => {
          console.log(chalk.green(`[MUSIC] SoundCloud song finished playing.`));
          this.playNextSong();
        });
        this.dispatcher.on('error', (error) => {
          console.error(chalk.red(`[MUSIC] Error playing SoundCloud song: ${error}`));
          this.playNextSong();
        });
      } else if (song.source === 'local') {
        await this.playLocalFile(song.path);
      }
    } catch (error) {
      console.error(chalk.red(`[MUSIC] Error playing song: ${error}`));
      this.playNextSong();
    }
  }

  async getSongData(source, url, title) {
    try {
      let songData;
      if (source === 'youtube') {
        const info = await ytdl.getInfo(url);
        songData = {
          source: 'youtube',
          url: url,
          title: title || info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails[0].url
        };
      } else if (source === 'soundcloud') {
        const info = await scdl.getInfo(url);
        songData = {
          source: 'soundcloud',
          url: url,
          title: title || info.title,
          thumbnail: info.artwork_url
        };
      } else if (source === 'local') {
        const filePath = path.resolve(url);
        if (fs.existsSync(filePath)) {
          songData = {
            source: 'local',
            path: filePath,
            title: path.basename(filePath).replace(/\.[^/.]+$/, ''), // Extract title from filename
            thumbnail: '' // No thumbnail for local files
          };
        } else {
          throw new Error(`Local file not found: ${filePath}`);
        }
      } else {
        throw new Error(`Unsupported music source: ${source}`);
      }
      return songData;
    } catch (error) {
      console.error(chalk.red(`[MUSIC] Error getting song data: ${error}`));
      return null;
    }
  }
}

module.exports = { MusicPlayer };