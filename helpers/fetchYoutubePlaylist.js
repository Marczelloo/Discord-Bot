const { default: YouTube } = require("youtube-sr");
const { setGlobalVariable, addToQueue } = require("../global");

module.exports = {
   fetchYoutubePlaylist: async function(url, interaction) {
      try 
      {
         const playlistId = url.split('list=')[1];
         const playlist = await YouTube.getPlaylist(playlistId);
         const videos = await new Promise((resolve, reject) => {
            playlist.fetch()
            .then(videos => resolve(videos))
            .catch(error => reject(error));
         })

         const videosArray = Array.from(videos);

         setGlobalVariable(interaction.guildId, "ageRestricted", false);

         await Promise.all(videosArray.map(video => {
            const newSong = {
                title: video.title,
                artist: video.channel.name,
                artist_url: video.channel.icon.url,
                url: video.url,
                image: video.thumbnail.url,
                length: video.durationFormatted,
            };

            addToQueue(interaction.guildId, newSong, "queue");
        }));

        console.log("Adding youtube playlist to queue");

        await interaction.editReply({ embeds: [ successEmbed("Playlist added to queue")]});
      }
      catch(error)
      {
         console.error("Error fetching youtube playlist: " + error);
         await interaction.editReply({ embeds: [ errorEmbed("Error adding playlist to queue, if the playlist is private, age restricted or your mix, the bot can't add it to the queue")]});
         return;
      }
   }
}