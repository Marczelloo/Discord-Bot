const { default: YouTube } = require("youtube-sr");
const { setGlobalVariable, addToQueue, QueueType } = require("../global");
const { songEmbed, errorEmbed } = require("./embeds");
const Log = require("./fancyLogs/log");

module.exports = {
   fetchYoutubeSong: async function(url, interaction) {
      try
      {
         Log.info("Fetching youtube song by URL", url, interaction.guild.id, interaction.guild.name);
         const songInfo = await YouTube.getVideo(url);

         if(songInfo.nsfw)
            setGlobalVariable(interaction.guildId, "ageRestricted", true);
         else
            setGlobalVariable(interaction.guildId, "ageRestricted", false);
   
         if(songInfo === null || songInfo === undefined)
         {
            Log.error("No search results found for the song by URL", null, interaction.guild.id, interaction.guild.name);
            await interaction.editReply({ embeds: [ errorEmbed("No search results found for the song")]});
            return
         }
         else if(songInfo.live)
         {
            Log.warning("Live video found, skipping", null, interaction.guild.id, interaction.guild.name);
            await interaction.editReply({ embeds: [ errorEmbed("You can't play live content")]});
            return;
         }
         else
         {
            const newSong = {
               title: songInfo.title,
               artist: songInfo.channel.name,
               artist_url: songInfo.channel.icon.url,
               url: url,
               image: songInfo.thumbnail.url,
               length: songInfo.durationFormatted,
           };
   
           addToQueue(interaction.guildId, newSong, QueueType.QUEUE);

           Log.success("Youtube song added to queue", null, interaction.guild.id, interaction.guild.name);
   
   
           await interaction.editReply({ embeds: [ songEmbed(newSong)]})
         }
      }
      catch(error)
      {
         Log.error("Error fetching youtube song by URL: " + error, null, interaction.guild.id, interaction.guild.name);
         await interaction.editReply({ embeds: [ errorEmbed("Error fetching youtube song, please check song URL or try again later")]});
         return;
      }
   }
}