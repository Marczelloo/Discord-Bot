const ytdl = require("@distube/ytdl-core");
const { shiftQueue, getServerData, QueueType } = require("../global");
const { errorEmbed } = require("./embeds");
const { play } = require("./play");
const fs = require('fs');
const Log = require("./fancyLogs/log");

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
      Log.info("Proceding to download song", null, interaction.guild.id, interaction.guild.name);
      let stream;

      if(getServerData(interaction.guild.id).queue[0].url.includes('spotify'))
         stream = ytdl(getServerData(interaction.guild.id).queue[0].yt_url, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
         });
      else
         stream = ytdl(getServerData(interaction.guild.id).queue[0].url, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
         });

      stream.on('error', error => {
         Log.error("Stream error: ", error, interaction.guild.id, interaction.guild.name);
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
            Log.progress("Downloading", progress, interaction.guild.id, interaction.guild.name);
      });

      writer.on('finish', () => {
         Log.success("Audio downloaded successfully", null, interaction.guild.id, interaction.guild.name);
         play(interaction, outputFilePath, connection, nowPlayingEmbed, nowPlayingEmbedFields, playingRow, pausedRow, disabledButtons);
     });

     writer.on('error', error => {
         Log.error("Write stream error: ", error, interaction.guild.id, interaction.guild.name);
      });
   }
   catch(error)
   {
      Log.error("Error downloading audio: ", error, interaction.guild.id, interaction.guild.name);
      await interaction.editReply({ embeds: [ errorEmbed("Error downloading audio")] });
      shiftQueue(interaction.guild.id, QueueType.QUEUE);
      playNextSong(interaction, connection);
   }
}

exports.downloadYtdl = downloadYtdl;