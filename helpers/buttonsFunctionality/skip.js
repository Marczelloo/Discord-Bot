const { getServerData } = require("../../global");

module.exports = {
   skip: async function(interaction, 
      confirmation, 
      collector, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      disabledButtons) {
      console.log("Skip button clicked. Skipping to the next song");
      collector.stop();
      getServerData(interaction.guild.id).player.stop();

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

         collector.stop();
         getServerData(interaction.guild.id).player.stop();

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            components: [ disabledButtons],
            position: 'end'
         });
      }
   }
}