const ytdl = require("@distube/ytdl-core");
const { shiftQueue, getServerData } = require("../global");
const { errorEmbed } = require("./embeds");
const { play } = require("./play");
const fs = require('fs');

async function downloadYtdl(interaction, 
   outputFilePath, 
   connection, 
   nowPlayingEmbed, 
   nowPlayingEmbedFields,
   pausedRow,
   playingRow,
   disabledButtons) {
   const { playNextSong } = require("./playNextSong");

   try
   {
      console.log("Downloading song");
      let stream;

      if(getServerData(interaction.guild.id).queue[0].url.includes('spotify'))
         stream = ytdl(getServerData(interaction.guild.id).queue[0].yt_udl, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
         });
      else
         stream = ytdl(getServerData(interaction.guild.id).queue[0].url, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
         });

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
         play(interaction, outputFilePath, connection, nowPlayingEmbed, nowPlayingEmbedFields, playingRow, pausedRow, disabledButtons);
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
      playNextSong(interaction, connection);
   }
}

exports.downloadYtdl = downloadYtdl;