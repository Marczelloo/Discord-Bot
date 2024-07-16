const { setGlobalVariable } = require("../global");
const songEmbed = require("./songEmbed");

module.exports = {
   fetchYoutubeSong: async function(url, interaction) {
      const songInfo = await YouTube.getVideo(url);

      if(songInfo.nsfw)
         setGlobalVariable(interaction.guildId, "ageRestricted", true);
      else
         setGlobalVariable(interaction.guildId, "ageRestricted", false);

      if(songInfo === null || songInfo === undefined)
      {
         console.log("No search results found for the song by URL");
         await interaction.editReply({ embeds: [ errorEmbed("No search results found for the song")]});
         return
      }
      else if(songInfo.live)
      {
         console.log("Live video found, skipping");
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

        addToQueue(interaction.guildId, newSong, "queue");

        console.log("Adding youtube song to queue by URL");

        await interaction.editReply({ embeds: [ songEmbed(newSong)]})
      }
   }
}