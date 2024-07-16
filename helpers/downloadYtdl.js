const { getServerData } = require("../global");
const { errorEmbed } = require("./embeds");
const play = require("./play");
const playNextSong = require("./playNextSong");

module.exports = {
   downloadYtdl: async function(interaction, url, outputFilePath, connection) {
      try
      {
         console.log("Downloading song");
         let stream;
   
         if(song.url.includes('spotify'))
            stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
         else
            stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
   
         stream.on('error', error => {
            console.error(`Stream error: ${error.message}`);
         });
   
         const writer = stream.pipe(fs.createWriteStream(outputFilePath));
   
         let totalSize = 0;
         stream.on('response', (res) => {
            totalSize = res.headers['content-length'];
         });
   
         let downloadedSize = 0;
         stream.on('data', (chunk) => {
               downloadedSize += chunk.length;
               const progress = (downloadedSize / totalSize) * 100;
               process.stdout.clearLine();
               process.stdout.cursorTo(0);
               process.stdout.write(`Downloading: ${progress.toFixed(2)}%`);
         });
   
         writer.on('finish', () => {
            console.log("\nAudio downloaded successfully");
            play(interaction, outputFilePath, connection);
        });
   
        writer.on('error', error => {
         console.error(`Write stream error: ${error.message}`);
         });
      }
      catch(error)
      {
         console.error("Error downloading audio: " + error);
         await interaction.editReply({ embeds: [ errorEmbed("Error downloading audio")] });
         shiftQueue(interaction.guild.id, "queue");
         playNextSong();
      }
   }
}