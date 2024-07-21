const { getServerData } = require("../../global");
const Log = require("../fancyLogs/log");

module.exports = {
   skip: async function(interaction, 
      confirmation, 
      collector, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      disabledButtons) {
      Log.info("Skip button clicked", null, interaction.guild.id, interaction.guild.name);
      collector.stop();
      getServerData(interaction.guild.id).player.stop();
      Log.info("Song skipped", null, interaction.guild.id, interaction.guild.name);
         
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
         Log.error("Skip Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);

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