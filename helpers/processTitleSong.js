const YouTube = require('youtube-sr').default;
const ytsr = require("ytsr");
const { errorEmbed, songEmbed } = require("./embeds");
const { setGlobalVariable, addToQueue } = require("../global");

module.exports = {
   processTitleSong: async function(title, interaction) {
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
            console.log("No search results found for the song by name");
            await interaction.editReply({ embeds: [ errorEmbed("No search results found for the song")]});
         }

         if(video.live)
         {
            console.log("Live video found, skipping");
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
   
            console.log("Adding youtube song to queue by name");
   
            await interaction.editReply({ embeds: [ songEmbed(newSong)]})
         }
      })
      .catch(async error => {
         console.error("Error fetching youtube song by name: " + error);
         await interaction.editReply({ embeds: [ errorEmbed("Error fetching youtube song, please check song name or try again later")]});
         return;
      });
   }
}