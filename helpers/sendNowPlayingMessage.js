const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable } = require("../global");

module.exports = {
   sendNowPlayingMessage: async function(interaction,   
      nowPlayingEmbed, 
      playingRow, 
      pausedRow) {

      if(getServerData(interaction.guild.id).player.AudioPlayerStatus === AudioPlayerStatus.Paused)
      {
         console.log("Sending paused message");
         setGlobalVariable(interaction.guild.id, "coll", await interaction.channel.send({
            embeds: [ nowPlayingEmbed ],
            components: [ pausedRow ],
            position: 'end'
         })
         .then(nowPlayingMessage => {
            setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
            setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
         })
         .catch(console.error));
      }
      else
      {
         console.log("Sending playing message");
         setGlobalVariable(interaction.guild.id, "coll", await interaction.channel.send({
            embeds: [ nowPlayingEmbed ],
            components: [ playingRow ],
            position: 'end'
         })
         .then(nowPlayingMessage => {
            setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
            setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
         })
         .catch(console.error));
      }

   }
}