const { getServerData } = require("../../global");

module.exports = {
   resume: async function(interaction, 
      confirmation, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      playingRow) {
      console.log("Resume button clicked. Resuming the song");
      getServerData(interaction.guild.id).player.unpause();

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
         console.error("Error updating message: " + error);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            components: [ playingRow],
            position: 'end'
         });
      }
   }
}