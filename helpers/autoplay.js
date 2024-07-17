const { getServerData, setGlobalVariable } = require("../global");
const { autoplayGetNextSong } = require("./autoplayGetNextSong");
const { errorEmbed } = require("./embeds");

async function autoplay(interaction) {
   console.log("Autoplay enabled, searching for the next song");

   try
   {
      console.log("Trying to obatin spotify token");
      if(getServerData(interaction.guild.id).spotify_token_expires < Date.now() || getServerData(interaction.guild.id).spotify_token === null)
      {
         console.log("Token expired or empty. Refreshing token");
         await getSpotifyToken(interaction.guild.id);
      }

      if(getServerData(interaction.guild.id).spotify_token && getServerData(interaction.guild.id).spotify_token_expires > Date.now())
      {
         let trackId;
         let artistId;

         const data = await spotifyGetSongData(getServerData(interaction.guild.id).queue[0].title, interaction.guild.id);

         if(data == null)
         {
            console.log("No track Id found");

            await getServerData(interaction.guild.id).commandChannel.send({ embeds: [errorEmbed("No track ID found for the song")]});

            setGlobalVariable(interaction.guild.id, "autoplay", false);
            return;
         }

         trackId = data.trackId;
         artistId = data.artistId;

         autoplayGetNextSong(interaction, trackId, artistId);

      }
   }
   catch(error)
   {
      console.error("Autoplay error: " + error);

      await getServerData(interaction.guild.id).commandChannel.send({ embeds: [errorEmbed("Error getting next song, please try again later")]});
   }
}

exports.autoplay = autoplay;