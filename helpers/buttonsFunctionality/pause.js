const { getServerData } = require("../../global");
const Log = require("../fancyLogs/log");

module.exports = {
   pause: async function(interaction, 
      confirmation, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      disabledButtons) {
      Log.info("Pause button clicked", null, interaction.guild.id, interaction.guild.name);
      getServerData(interaction.guild.id).player.pause();
      Log.info("Player paused", null, interaction.guild.id, interaction.guild.name);

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
         Log.error("Pause Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            components: [ disabledButtons],
            position: 'end'
         });
      }
   }
}