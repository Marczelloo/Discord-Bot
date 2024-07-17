const { getServerData } = require("../global");
const { errorEmbed } = require("./embeds");
const { fetchSpotifyPlaylist } = require("./fetchSpotifyPlaylist");
const { fetchSpotifySong } = require("./fetchSpotifySong");
const { fetchYoutubePlaylist } = require("./fetchYoutubePlaylist");
const { fetchYoutubeSong } = require("./fetchYoutubeSong");
const { obtainSpotifyToken } = require("./obtainSpotifyToken");

module.exports = {
   processUrlSong: async function(url, interaction) {
      const isSpotifyUrl = url.includes('spotify');
      const isYoutubeUrl = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[^&]+|youtu\.be\/[^&]+)/.test(url);

      let songInfo;
      let playlist;

      if(isSpotifyUrl)
      {
         const spotifyPlaylistPattern = /^https?:\/\/(open\.)?spotify\.com\/playlist\/[a-zA-Z0-9]+\?/.test(url);

         if(spotifyPlaylistPattern)
            playlist = true;
         else
            playlist = false;

         if(getServerData(interaction.guildId).spotify_token_expires < Date.now() || !getServerData(interaction.guildId).spotify_token)
            await obtainSpotifyToken(interaction);
         
         if(playlist)
            await fetchSpotifyPlaylist(url, interaction);
         else
            await fetchSpotifySong(url, interaction);

      }
      else if(isYoutubeUrl)
      {
         const youtubePlaylistPattern = url.includes('list');

         if(youtubePlaylistPattern)
            playlist = true;
         else
            playlist = false;

         if(playlist)
         {
            const regex = /list=([a-zA-Z0-9_-]+)/;
            const match = url.match(regex);
            if (match) 
            {
               fetchYoutubePlaylist(url, interaction);
            }
            else 
            {
               await interaction.editReply({ embeds: [ errorEmbed("No playlist id found in link, please check your playlist link or try again later") ] });
               return;
            }
         }
         else
         {
            await fetchYoutubeSong(url, interaction);
         }
         
      }
      else 
      {
         await interaction.editReply({ embeds: [ errorEmbed("Invalid URL") ] });
         return;
      }
   }
}