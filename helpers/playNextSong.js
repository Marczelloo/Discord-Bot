const ytsr = require("ytsr");
const { setSongInQueue, getServerData } = require("../global");
const formatTime = require("./formatTime");
const { playerEmbed } = require("./embeds");
const play = require("./play");
const { VoiceChannel } = require("discord.js");
const { nowPlayingEmbedFields } = require("./nowPlayingEmbedFields");

module.exports = {
   playNextSong: async function(interaction, connection) {
      let outputFilePath;

      if(getServerData(interaction.guild.id).queue == 0)
      {
         setGlobalVariable(interaction.guild.id, "player", getServerData(interaction.guild.id).player.stop());
      }

      let formattedTime;
      if(getServerData(interaction.guild.id).queue[0].toString().includes(":"))
      {
         formattedTime = getServerData(interaction.guild.id).queue[0].length;
      }
      else
      {
         formattedTime = formatTime(getServerData(interaction.guild.id).queue[0].length);
      }

      if(getServerData(interaction.guild.id).queue[0].url.includes("spotify"))
      {
         const video = await ytsr(getServerData(interaction.guild.id).queue[0].title + " " + getServerData(interaction.guild.id).queue[0].artist, { limit: 1})[0];
      
         const song = getServerData(interaction.guild.id).queue[0];
         song.yt_url = video.url;
         song.length = video.duration;
         song.artist_url = video.author.bestAvatar.url;

         setSongInQueue(interaction.guild.id, 0, song, "queue");
      }
      const song = getServerData(interaction.guild.id).queue[0];

      const embedFields = nowPlayingEmbedFields(interaction.guild.id, song, formattedTime);

      const nowPlayingEmbed = playerEmbed(song.title, song.url, song.image, song.artist, song.artist_url);

      if(getServerData(interaction.guidl.id).ageRestricted)
         downloadYtdlp(interaction, song.url, outputFilePath, connection);
      else
         downloadYtdlp(interaction, song.url, outputFilePath, connection);
   }
}