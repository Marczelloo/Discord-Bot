const { getServerData } = require("../../global");
const Log = require("../fancyLogs/log");

module.exports = {
   resume: async function(interaction, 
      confirmation, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      playingRow) {
      Log.info("Resume button clicked", null, interaction.guild.id, interaction.guild.name);
      getServerData(interaction.guild.id).player.unpause();
      Log.info("Player unpaused", null, interaction.guild.id, interaction.guild.name);

      nowPlayingEmbedFields[1].value = 'Playing';
      nowPlayingEmbed.setFields(nowPlayingEmbedFields);

      try
      {
         await confirmation.update({
            embeds: [ nowPlayingEmbed ],
            components: [ playingRow],
            position: 'end' 
         });
      }
      catch(error)
      {
         Log.error("Resume Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            components: [ playingRow],
            position: 'end'
         });
      }
   }
}