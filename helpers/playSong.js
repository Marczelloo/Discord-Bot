const { joinVoiceChannel, createAudioPlayer } = require("@discordjs/voice");
const { setGlobalVariable, getServerData } = require("../global");

module.exports = {
   playSong: function(interaction, voiceChannel) {
      const connection = joinVoiceChannel({
         channelId: voiceChannel.id,
         guild: voiceChannel.guild.id,
         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      if(!connection)
      {
         console.error("Error joining voice channel");
         return;
      }

      if(getServerData(interaction.guild.id).player == null)
      {
         setGlobalVariable(interaction.guild.id, "player", createAudioPlayer());
      }

   }
}