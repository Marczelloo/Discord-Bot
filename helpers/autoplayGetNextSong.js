const { addToQueue, getServerData, setGlobalVariable } = require("../global");
const { errorEmbed } = require("./embeds");

module.exports = {
   autoplayGetNextSong: async function(interaction, trackId, artistId) {
      try 
      {
         console.log("Spotify token obtained");
         const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${encodeURIComponent(trackId)}&seed_artist=${encodeURIComponent(artistId)}&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + globals.spotify_token,
                'Content-Type': 'application/json'
            },

         });

         const data = await response.json();
         console.log("Spotify song obtained");

         const song = data.tracks[0];
         const searchResults = await ytsr(song.name + " " + song.artists[0].name, { limit: 1});

         const video = searchResults.items[0];
         const time = song.duration_ms / 1000;
         const formatedTime = time.toString().includes(":") ? time : new Date(time * 1000).toISOString().substr(time < 3600 ? 14 : 11, 5);
         const newSong = {
             title: video.title,
             artist: video.author.name,
             artist_url: video.author.bestAvatar.url,
             url: video.url,
             image: video.bestThumbnail.url,
             length: formatedTime
         };

         addToQueue(interaction.guild.id, newSong, "queue");
         console.log("Autoplay song added to queue");
      }
      catch(error)
      {
         console.error("Error getting next song: " + error);

         await getServerData(interaction.guild.id).commandChannel.send({ embeds: [errorEmbed("Error getting next song, please try again later")]});
         setGlobalVariable(interaction.guild.id, "autoplay", false);
         return;
      }
   }
}