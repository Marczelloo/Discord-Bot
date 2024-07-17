const { getServerData, unshiftQueue, setGlobalVariable } = require("../../global")

module.exports = {
   rewind: async function(interaction, 
      confirmation, 
      collector, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      disabledButtons)
   {
      if(getServerData(interaction.guild.id).playedSongs.length === 0)
      {
         console.log("Rewind button clicked. No previous songs in queue, rewinding to the beginning of the song");
         unshiftQueue(interaction.guild.id, "queue");
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

            await getServerData(interaction.guild.id).playerMessage.edit({
               embeds: [ nowPlayingEmbed],
               components: [ disabledButtons],
               position: 'end'
            });
         }

         return;
      }

      console.log("Rewind button clicked. Rewinding to the previous song");
      setGlobalVariable(interaction.guild.id, "playEarlier", true);
      getServerData(interaction.guild.id).player.stop();
      collector.stop();

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