const ytsr = require('ytsr');
const { setSongInQueue, getServerData, setGlobalVariable, shiftQueue } = require("../global");
const { formatTime } = require("./formatTime");
const { playerEmbed } = require("./embeds");
const { nowPlayingEmbedFields } = require("./nowPlayingEmbedFields");
const { downloadYtdlp } = require("./downloadYtdlp");
const { downloadYtdl } = require("./downloadYtdl");
const Log = require('./fancyLogs/log');
const { default: YouTube } = require('youtube-sr');
const fs = require('fs');

async function playNextSong(interaction, 
   connection,
   pausedRow,
   playingRow,
   disabledButtons) {
   let outputFilePath;

   Log.info("Playing next song", null, interaction.guild.id, interaction.guild.name);

   if(getServerData(interaction.guild.id).queue.length == 0)
   {
      setGlobalVariable(interaction.guild.id, "player", getServerData(interaction.guild.id).player.stop());
   }

   let formattedTime;
   if(getServerData(interaction.guild.id).queue[0].length.toString().includes(":"))
   {
      formattedTime = getServerData(interaction.guild.id).queue[0].length;
   }
   else
   {
      formattedTime = formatTime(getServerData(interaction.guild.id).queue[0].length);
   }

   if(getServerData(interaction.guild.id).queue[0].url.includes("spotify"))
   {
      try
      {
         Log.info("Trying to get spotify song info with ytsr", null, interaction.guild.id, interaction.guild.name);
         const video = await ytsr(getServerData(interaction.guild.id).queue[0].title + " " + getServerData(interaction.guild.id).queue[0].artist, { limit: 1});
         const videoInfo = video.items[0];
               
         const song = getServerData(interaction.guild.id).queue[0];
         song.yt_url = videoInfo.url;
         song.length = videoInfo.duration;
         song.artist_url = videoInfo.author.bestAvatar.url;
      }
      catch(error)
      {
         Log.error("Error getting spotify song info ytld", error, interaction.guild.id, interaction.guild.name);
         Log.info("Trying to get spotify song info with YouTube.search", null, interaction.guild.id, interaction.guild.name);
         YouTube.search(getServerData(interaction.guild.id).queue[0].title + " " + getServerData(interaction.guild.id).queue[0].artist, { limit: 1 })
         .then(async video => {
            const song = getServerData(interaction.guild.id).queue[0];
            song.yt_url = video[0].url;
            song.length = video[0].duration;
            song.artist_url = video[0].channel.url;
         })
         .catch(error => {
            Log.error("Error getting spotify song info with Yutube.search", error, interaction.guild.id, interaction.guild.name);
            interaction.editReply({ content: "There was an error getting the song info. Please try again."})
            shiftQueue(interaction.guild.id, 0, "queue");
            playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
         })
      }

      setSongInQueue(interaction.guild.id, 0, song, "queue");
   }
   const song = getServerData(interaction.guild.id).queue[0];

   const embedFields = nowPlayingEmbedFields(interaction.guild.id, song, formattedTime);

   const nowPlayingEmbed = playerEmbed(song.title, song.url, song.image, song.artist, song.artist_url);

   const tempFolderPath = __dirname + "/../temp/";
   if (!fs.existsSync(tempFolderPath)) 
   {
      fs.mkdirSync(tempFolderPath);
   }
   outputFilePath = tempFolderPath + "output_" + interaction.guild.id + ".ogg";

   if(getServerData(interaction.guild.id).ageRestricted)
      downloadYtdlp(interaction, song.url, outputFilePath, connection, nowPlayingEmbed, embedFields, pausedRow, playingRow, disabledButtons);
   else
      downloadYtdl(interaction, outputFilePath, connection, nowPlayingEmbed, embedFields, pausedRow, playingRow, disabledButtons);
} 

exports.playNextSong = playNextSong;
