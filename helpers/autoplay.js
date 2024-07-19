const { getServerData, setGlobalVariable } = require("../global");
const { autoplayGetNextSong } = require("./autoplayGetNextSong");
const { errorEmbed } = require("./embeds");
const Log = require("./fancyLogs/log");

async function autoplay(interaction) {
   Log.info("Autoplay enabled, searching for the next song", null, interaction.guild.id, interaction.guild.name);

   try
   {
      Log.info("Trying to obtain spotify token", null, interaction.guild.id, interaction.guild.name);
      if(getServerData(interaction.guild.id).spotify_token_expires < Date.now() || getServerData(interaction.guild.id).spotify_token === null)
      {
         Log.warning("Token expired or empty. Refreshing token", null, interaction.guild.id, interaction.guild.name);
         await getSpotifyToken(interaction.guild.id);
      }

      if(getServerData(interaction.guild.id).spotify_token && getServerData(interaction.guild.id).spotify_token_expires > Date.now())
      {
         let trackId;
         let artistId;

         const data = await spotifyGetSongData(getServerData(interaction.guild.id).queue[0].title, interaction.guild.id);

         if(data == null)
         {
            Log.error("No track Id found", null, interaction.guild.id, interaction.guild.name);

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
      Log.error("Autoplay error: ", error, interaction.guild.id, interaction.guild.name);

      await getServerData(interaction.guild.id).commandChannel.send({ embeds: [errorEmbed("Error getting next song, please try again later")]});
   }
}

exports.autoplay = autoplay;