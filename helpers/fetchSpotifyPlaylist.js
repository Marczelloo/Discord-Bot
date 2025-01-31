const { setGlobalVariable, addToQueue, getServerData, QueueType } = require("../global");
const { errorEmbed, successEmbed } = require("./embeds");
const Log = require("./fancyLogs/log");

module.exports = {
   fetchSpotifyPlaylist: async function(url, interaction) {
      const playlistId = url.split('/').pop();
      const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

      try
      {
         Log.info("Fetching spotify playlist", null, interaction.guild.id, interaction.guild.name);
         const token = getServerData(interaction.guildId).spotify_token;

         let response = await fetch(apiUrl, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         let data = await response.json();
         let tracks = data.tracks.items;

         setGlobalVariable(interaction.guildId, "ageRestricted", false);

         if(data.tracks.total > 100)
         {
            let next = data.tracks.next;
            while(true)
            {
               await Promise.all(tracks.map(async track => {
                  const time = track.track.duration_ms / 1000;
                  const formatedTime = time.toString().includes(":") ? time : new Date(time * 1000).toISOString().substr(time < 3600 ? 14 : 11, 5);
                  
                  const newSong = {
                      title: track.track.name,
                      artist: track.track.artists[0].name,
                      artist_url: track.track.artists[0].external_urls.spotify,
                      url: track.track.external_urls.spotify,
                      image: track.track.album.images[0].url,
                      length: formatedTime,
                  };
      
                  addToQueue(interaction.guildId, newSong, QueueType.QUEUE);
               }));

               response = await fetch(next, {
                  headers: {
                     'Authorization': `Bearer ${token}`
                  }
               });

               data = await response.json();

               console.log(data);

               tracks = data.items;

               if(!data.next) break;
               else next = data.next;
            }
         }
         else
         {
            await Promise.all(tracks.map(async track => {
               const time = track.track.duration_ms / 1000;
               const formatedTime = time.toString().includes(":") ? time : new Date(time * 1000).toISOString().substr(time < 3600 ? 14 : 11, 5);
               
               const newSong = {
                   title: track.track.name,
                   artist: track.track.artists[0].name,
                   artist_url: track.track.artists[0].external_urls.spotify,
                   url: track.track.external_urls.spotify,
                   image: track.track.album.images[0].url,
                   length: formatedTime,
               };
   
               addToQueue(interaction.guildId, newSong, QueueType.QUEUE);
            }));
         }

         Log.success("Added spotify playlist to queue", null, interaction.guild.id, interaction.guild.name);

         await interaction.editReply({ embeds: [ successEmbed("Songs are proccessing and they will be added in a while.") ]});
      }
      catch(error)
      {
         Log.error("Error fetching spotify playlist: " + error, null, interaction.guild.id, interaction.guild.name);
         await interaction.editReply({ embeds: [ errorEmbed("Error fetching spotify playlist, please check playlist link or try again later")]});
         return;
      }
   }
}