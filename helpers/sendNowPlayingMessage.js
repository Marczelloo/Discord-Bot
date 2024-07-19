const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable } = require("../global");

module.exports = {
   sendNowPlayingMessage: async function(interaction,   
      nowPlayingEmbed, 
      playingRow, 
      pausedRow) {

      if(getServerData(interaction.guild.id).player.AudioPlayerStatus === AudioPlayerStatus.Paused)
      {
         Log.info("Sending paused message", null, interaction.guild.id, interaction.guild.name);
         setGlobalVariable(interaction.guild.id, "coll", await interaction.channel.send({
            embeds: [ nowPlayingEmbed ],
            components: [ pausedRow ],
            position: 'end'
         })
         .then(nowPlayingMessage => {
            setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
            setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
         })
         .catch(error => {
            Log.error("Error sending paused message: ", error, interaction.guild.id, interaction.guild.name);
         }));
      }
      else
      {
         Log.info("Sending playing message", null, interaction.guild.id, interaction.guild.name);
         setGlobalVariable(interaction.guild.id, "coll", await interaction.channel.send({
            embeds: [ nowPlayingEmbed ],
            components: [ playingRow ],
            position: 'end'
         })
         .then(nowPlayingMessage => {
            setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
            setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
         })
         .catch(error => {
            Log.error("Error sending playing message: ", error, interaction.guild.id, interaction.guild.name);
         }));
      }

   }
}