const { getServerData } = require("../../global");

module.exports = {
   pause: async function(interaction, 
      confirmation, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      disabledButtons) {
      console.log("Pause button clicked. Pausing the song");
      getServerData(interaction.guild.id).player.pause();

      nowPlayingEmbedFields[1].value = 'Paused';
      nowPlayingEmbed.setFields(nowPlayingEmbedFields);

      try
      {
         await confirmation.update({
            embeds: [ nowPlayingEmbed ],
            components: [ disabledButtons],
            position: 'end' 
         });
      }
      catch(error)
      {
         console.error("Error updating message: " + error);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            components: [ disabledButtons],
            position: 'end'
         });
      }
   }
}