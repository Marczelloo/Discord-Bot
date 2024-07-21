const { getServerData, setGlobalVariable } = require("../global");
const { errorEmbed } = require("./embeds");
const Log = require("./fancyLogs/log");

module.exports = {
   spotifyGetSongData: async function(title, guildId) {
      try
      {
         Log.info("Getting spotify track data", null, guildId, getServerData(guildId).guild.name);
         const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}&type=track&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getServerDate(guildId).spotify_token,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const track = data.tracks.items[0];

        if(!data) {
             Log.error("No search results found for the song", null, guildId, getServerData(guildId).guild.name);
             await getServerData(guildId).commandChannel.send({ embeds: [errorEmbed("No search results found for the song")]});
             return null;
        }

        if(!track) {
             Log.error("No track found", null, guildId, getServerData(guildId).guild.name);
             await getServerData(guildId).commandChannel.send({ embeds: [errorEmbed("No track found for the song")]});
             return null;
        }

        Log.success("Spotify track data obtained", null, guildId, getServerData(guildId).guild.name);

        return {
         trackId: track.id,
         artistId: track.artist[0].id
        }
      }
      catch(error) 
      {
         Log.error("Error getting track ID: " + error, null, guildId, getServerData(guildId).guild.name);

         await getServerData(guildId).commandChannel.send({ embeds: [errorEmbed("Error getting track ID, please try again later")]});

         setGlobalVariable(guildId, "autoplay", false);
         return null;
      }
      
   }
}