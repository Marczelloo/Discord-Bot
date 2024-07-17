const path = require('path');
const util = require('util');

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
      console.log(`Audio downloaded successfully: ${stdout}`);

      if (stdout.trim() !== "") 
      {
         play(interaction, outputFilePath, connection, nowPlayingEmbed, nowPlayingEmbedFields, playingRow, pausedRow, disabledButtons);
      } 
      else 
      {
         console.log("No output from download command, skipping play.");
      }
   } 
   catch (error) 
   {
      console.error(`Error executing command: ${error}`);
      await interaction.editReply({ embeds: [errorEmbed("Error downloading audio, please try again later")] });
      shiftQueue(interaction.guild.id, "queue");
      playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
   }
}

exports.downloadYtdlp = downloadYtdlp;
