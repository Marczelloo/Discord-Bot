const ytsr = require('ytsr');
const { setSongInQueue, getServerData, setGlobalVariable } = require("../global");
const { formatTime } = require("./formatTime");
const { playerEmbed } = require("./embeds");
const { nowPlayingEmbedFields } = require("./nowPlayingEmbedFields");
const { downloadYtdlp } = require("./downloadYtdlp");
const { downloadYtdl } = require("./downloadYtdl");

async function playNextSong(interaction, 
   connection,
   pausedRow,
   playingRow,
   disabledButtons) {
   let outputFilePath;

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
         const video = await ytsr(getServerData(interaction.guild.id).queue[0].title + " " + getServerData(interaction.guild.id).queue[0].artist, { limit: 1});
         const videoInfo = video.items[0];
         
         console.log(videoInfo);
      
         const song = getServerData(interaction.guild.id).queue[0];
         song.yt_url = videoInfo.url;
         song.length = videoInfo.duration;
         song.artist_url = videoInfo.author.bestAvatar.url;

         setSongInQueue(interaction.guild.id, 0, song, "queue");
      }
      const song = getServerData(interaction.guild.id).queue[0];

      const embedFields = nowPlayingEmbedFields(interaction.guild.id, song, formattedTime);

      const nowPlayingEmbed = playerEmbed(song.title, song.url, song.image, song.artist, song.artist_url);

      outputFilePath = __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg";

      if(getServerData(interaction.guild.id).ageRestricted)
         downloadYtdlp(interaction, song.url, outputFilePath, connection, nowPlayingEmbed, embedFields, pausedRow, playingRow, disabledButtons);
      else
         downloadYtdl(interaction, outputFilePath, connection, nowPlayingEmbed, embedFields, pausedRow, playingRow, disabledButtons);
}

exports.playNextSong = playNextSong;
