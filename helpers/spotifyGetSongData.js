const { getServerData, setGlobalVariable } = require("../global");
const { errorEmbed } = require("./embeds");

module.exports = {
   spotifyGetSongData: async function(title, guildId) {
      try
      {
         const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}&type=track&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getServerDate(guildId).spotify_token,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const track = data.tracks.items[0];

        return {
         trackId: track.id,
         artistId: track.artist[0].id
        }
      }
      catch(error) 
      {
         console.error("Error getting track ID: " + error);

         await getServerData(guildId).commandChannel.send({ embeds: [errorEmbed("Error getting track ID, please try again later")]});

         setGlobalVariable(guildId, "autoplay", false);
         return null;
      }
      
   }
}