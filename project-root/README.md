# Discord Music Bot

This is a comprehensive Discord music bot built with Node.js and Discord.js, allowing users to play music from YouTube, SoundCloud, and local files, create and manage playlists, control playback, adjust volume, and more.

## Getting Started

### Prerequisites

* Node.js and npm installed on your system: [https://nodejs.org/](https://nodejs.org/)
* A Discord bot account with a token: [https://discord.com/developers/applications](https://discord.com/developers/applications)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/project-title.git
   ```

2. Navigate to the project directory:
   ```bash
   cd project-title
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the project root directory.
2. Add the following environment variables to the `.env` file:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   YOUTUBE_API_KEY=your_youtube_api_key
   SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
   ```

   * Replace `your_discord_bot_token` with your actual Discord bot token.
   * Replace `your_youtube_api_key` with your YouTube Data API v3 key.
   * Replace `your_soundcloud_client_id` with your SoundCloud API client ID.

3. (Optional) Customize the bot configuration in `config.json`.

### Running the Bot

1. Run the following command to start the bot:
   ```bash
   node bot.js
   ```

## Usage

**Core Commands:**

* `!play [song url/file path]` - Plays a song from YouTube, SoundCloud, or a local file.
* `!queue` - Displays the current song queue.
* `!skip` - Skips to the next song in the queue.
* `!stop` - Stops the music playback.
* `!volume [number]` - Adjusts the volume (0-1).
* `!loop` - Toggles loop mode for the current song or playlist.
* `!nowplaying` - Displays information about the currently playing song.

**Playlist Commands:**

* `!playlist create [playlist name]` - Creates a new playlist.
* `!playlist load [playlist name]` - Loads a playlist and starts playing its songs.
* `!playlist save [playlist name]` - Saves the current queue as a playlist.

**Search Command:**

* `!search [query]` - Searches for songs on YouTube and SoundCloud.

**Help Command:**

* `!help` - Displays a list of available commands.

## Deployment

### Hosting on Heroku

1. Create a Heroku account if you don't have one: [https://www.heroku.com/](https://www.heroku.com/)
2. Create a new Heroku app: [https://dashboard.heroku.com/new](https://dashboard.heroku.com/new)
3. Set up the Heroku environment variables:
   ```bash
   heroku config:set DISCORD_TOKEN=your_discord_bot_token
   heroku config:set YOUTUBE_API_KEY=your_youtube_api_key
   heroku config:set SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
   ```
4. Push the code to Heroku:
   ```bash
   git push heroku main
   ```
5. Start the app on Heroku:
   ```bash
   heroku open
   ```

### Hosting on AWS

1. Create an AWS account if you don't have one: [https://aws.amazon.com/](https://aws.amazon.com/)
2. Set up an EC2 instance or use AWS Elastic Beanstalk.
3. Install Node.js and npm on the server.
4. Clone the repository and install dependencies.
5. Configure the environment variables.
6. Start the bot using `node bot.js`.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

This project uses various libraries and APIs. Please see the `package.json` file for the complete list of dependencies.