const { setGlobalVariable } = require("../global");
const errorEmbed = require("./errorEmbed");

module.exports = {
   obtainSpotifyToken: async function(interaction) {
      try 
      {
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
            console.error("Error obtaining spotify token: " + data.error);
            await interaction.editReply({ embeds: [ errorEmbed("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json")]});
            return;
         }

         setGlobalVariable(interaction.guildId, "spotify_token", data.access_token);
         setGlobalVariable(interaction.guildId, "spotify_token_expires", Date.now() + data.expires_in * 1000);
      }
      catch(error)
      {
         console.error("Error obtaining spotify token: " + error);
         await interaction.editReply({ embeds: [ errorEmbed("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json or try again later")]});
         return;
      }
   }
}