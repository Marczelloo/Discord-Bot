const YouTube = require('youtube-sr').default;
const ytsr = require("ytsr");
const { errorEmbed, songEmbed } = require("./embeds");
const { setGlobalVariable, addToQueue } = require("../global");
const Log = require('./fancyLogs/log');

module.exports = {
   processTitleSong: async function(title, interaction) {
      Log.info("Processing song by name", null, interaction.guild.id, interaction.guild.name);
      const searchResults = await ytsr(title, { limit: 1});
      const video = searchResults.items[0];

      await YouTube.getVideo(video.url)
      .then(async video => {
         if(video.nsfw)
            setGlobalVariable(interaction.guildId, "ageRestricted", true);
         else
            setGlobalVariable(interaction.guildId, "ageRestricted", false);

         if(!video)
         {
            Log.error("No search results found for the song by name", null, interaction.guild.id, interaction.guild.name);
            await interaction.editReply({ embeds: [ errorEmbed("No search results found for the song")]});
         }

         if(video.live)
         {
            Log.warning("Live video found, skipping", null, interaction.guild.id, interaction.guild.name);
            await interaction.editReply({ embeds: [ errorEmbed("You can't play live content")]});
            return;
         }
         else
         {
            const newSong = {
               title: video.title,
               artist: video.channel.name,
               artist_url: video.channel.icon.url,
               url: video.url,
               image: video.thumbnail.url,
               length: video.durationFormatted
            };
   
            addToQueue(interaction.guildId, newSong, "queue");
   

            Log.info("Added youtube song to queue by name", null, interaction.guild.id, interaction.guild.name);
   
            await interaction.editReply({ embeds: [ songEmbed(newSong)]})
         }
      })
      .catch(async error => {
         Log.error("Error fetching youtube song by name: " + error, null, interaction.guild.id, interaction.guild.name);
         await interaction.editReply({ embeds: [ errorEmbed("Error fetching youtube song, please check song name or try again later")]});
         return;
      });
   }
}