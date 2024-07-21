const chalk = require('chalk');
const { MessageEmbed } = require('discord.js');

class Helper {
  constructor(prefix) {
    this.prefix = prefix;
  }

  /**
   * Formats a message for display in Discord chat.
   * @param {string} message The message to format.
   * @param {string} color The color code for the message.
   * @returns {string} The formatted message.
   */
  formatMessage(message, color = 'DEFAULT') {
    switch (color) {
      case 'SUCCESS':
        return chalk.green(message);
      case 'WARNING':
        return chalk.yellow(message);
      case 'ERROR':
        return chalk.red(message);
      default:
        return message;
    }
  }

  /**
   * Logs a message to the console for debugging.
   * @param {string} message The message to log.
   * @param {string} level The log level (info, warning, error).
   */
  log(message, level = 'info') {
    const timestamp = new Date().toLocaleString();
    switch (level) {
      case 'info':
        console.log(`${timestamp} [${chalk.blue('INFO')}] ${message}`);
        break;
      case 'warning':
        console.log(`${timestamp} [${chalk.yellow('WARNING')}] ${message}`);
        break;
      case 'error':
        console.log(`${timestamp} [${chalk.red('ERROR')}] ${message}`);
        break;
      default:
        console.log(`${timestamp} [${chalk.gray('LOG')}] ${message}`);
    }
  }

  /**
   * Extracts the command name from a Discord message.
   * @param {string} message The Discord message.
   * @returns {string} The command name.
   */
  getCommand(message) {
    const args = message.content.trim().split(/ +/);
    return args.length > 0 ? args[0].toLowerCase().slice(this.prefix.length) : null;
  }

  /**
   * Extracts the arguments from a Discord message.
   * @param {string} message The Discord message.
   * @returns {Array<string>} The arguments.
   */
  getArguments(message) {
    const args = message.content.trim().split(/ +/);
    return args.slice(1);
  }
}

module.exports = Helper;