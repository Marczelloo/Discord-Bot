const { exec } = require('child_process');
const { errorEmbed } = require('./embeds');
const playNextSong = require('./playNextSong');

module.exports = {
   downloadYtdlp: async function(interaction, url, outputFilePath, connection) {
      const exec = util.promisify(require('child_process').exec);

      const ytdlp_path = `"${path.resolve(__dirname, "yt-dlp.exe")}"`;
      const outputPath = `"${path.resolve(__dirname, "output")}"`;
      const command = `${ytdlp_path} -x --audio-format vorbis -o ${outputPath} ${url}`;
      console.log("Age restricted song processing");
      await executeCommand(command, interaction, outputFilePath, connection);
      console.log("Age restricted song processed");
   }
}

async function executeCommand(command, interaction, outputFilePath, connection) {
   try 
   {
      const { stdout, stderr } = await exec(command);
      console.log(`Audio downloaded successfully: ${stdout}`);
      play(interaction, outputFilePath, connection);
   }
   catch(error)
   {
      console.error(`Error executing command: ${error}`);

      await interaction.editReply({ embeds: [ errorEmbed("Error downloading audio, please try again later")]});
      shiftQueue(interaction.guild.id, "queue");
      playNextSong(interaction);
   }
}