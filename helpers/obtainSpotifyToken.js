const { setGlobalVariable } = require("../global");
const { errorEmbed } = require("./embeds");
const Log = require("./fancyLogs/log");

module.exports = {
   obtainSpotifyToken: async function(interaction) {
      try 
      {
         const spotify_clientID = process.env.SPOTIFY_CLIENT_ID;
         const spotify_clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
         
         if(!spotify_clientID || !spotify_clientSecret) {
            Log.error("Error obtaining spotify token: spotify_clientID or spotify_clientSecret not defined in environment variables");
            await interaction.editReply({ embeds: [ errorEmbed("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in environment variables")]});
         }


         Log.info("Obtaining spotify token", null, interaction.guild.id, interaction.guild.name);

         const reposne = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                  grant_type: 'client_credentials',
                  client_id: spotify_clientID,
                  client_secret: spotify_clientSecret
            }),
         });

         const data = await reposne.json();
         if(data.error)
         {
            Log.error("Error obtaining spotify token: " + data.error, null, interaction.guild.id, interaction.guild.name);
            await interaction.editReply({ embeds: [ errorEmbed("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json")]});
            return;
         }

         Log.info("Spotify token obtained", null, interaction.guild.id, interaction.guild.name);   

         setGlobalVariable(interaction.guildId, "spotify_token", data.access_token);
         setGlobalVariable(interaction.guildId, "spotify_token_expires", Date.now() + data.expires_in * 1000);
      }
      catch(error)
      {
         Log.error("Error obtaining spotify token: " + error, null, interaction.guild.id, interaction.guild.name);
         await interaction.editReply({ embeds: [ errorEmbed("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json or try again later")]});
         return;
      }
   }
}