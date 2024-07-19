const path = require('path');
const util = require('util');
const Log = require('./fancyLogs/log');

async function downloadYtdlp(interaction, 
   url, 
   outputFilePath, 
   connection, 
   nowPlayingEmbed, 
   nowPlayingEmbedFields,
   pausedRow,
   playingRow,
   disabledButtons) {
   const { playNextSong } = require('./playNextSong');
   const { play } = require('./play');
   const { shiftQueue, getServerData } = require('../global');
   const { errorEmbed } = require('./embeds');
   const exec = util.promisify(require('child_process').exec);

   try 
   {
      const ytdlpPath = path.resolve(__dirname, "yt-dlp.exe");
      const downloadPath = outputFilePath.replace(/\s/g, '_');
      const outputPath = path.resolve(__dirname, "../temp", path.basename(downloadPath.replace(/\.ogg$/, '')));
      const command = `"${ytdlpPath}" -x --audio-format vorbis -o "${outputPath}" ${url}`;
      
      const { stdout, stderr } = await exec(command);
      Log.info(`Downloading audio:`, stdout, interaction.guild.id, interaction.guild.name);

      if (stdout.trim() !== "") 
      {
         play(interaction, outputFilePath, connection, nowPlayingEmbed, nowPlayingEmbedFields, playingRow, pausedRow, disabledButtons);
      } 
      else 
      {
         Log.error(`Error downloading audio: ${stderr}`, null, interaction.guild.id, interaction.guild.name);
      }
   } 
   catch (error) 
   {
      Log.error("Error downloading audio: ", error, interaction.guild.id, interaction.guild.name);
      await interaction.editReply({ embeds: [errorEmbed("Error downloading audio, please try again later")] });
      shiftQueue(interaction.guild.id, "queue");
      playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
   }
}

exports.downloadYtdlp = downloadYtdlp;
