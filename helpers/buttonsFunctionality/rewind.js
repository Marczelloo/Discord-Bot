const { getServerData, unshiftQueue, setGlobalVariable, QueueType } = require("../../global");
const Log = require("../fancyLogs/log");

module.exports = {
   rewind: async function(interaction, 
      confirmation, 
      collector, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed,
      disabledButtons) {
      Log.info("Rewind button clicked", null, interaction.guild.id, interaction.guild.name);

      if(getServerData(interaction.guild.id).playedSongs.length === 0)
      {
         Log.info("No previous songs in queue, rewinding to the beginning of the song", null, interaction.guild.id, interaction.guild.name);
         unshiftQueue(interaction.guild.id, QueueType.QUEUE);
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
            Log.error("Rewind Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);

            await getServerData(interaction.guild.id).playerMessage.edit({
               embeds: [ nowPlayingEmbed],
               components: [ disabledButtons],
               position: 'end'
            });
         }

         return;
      }

      setGlobalVariable(interaction.guild.id, "playEarlier", true);
      getServerData(interaction.guild.id).player.stop();
      collector.stop();
      Log.info("Playing previous song", null, interaction.guild.id, interaction.guild.name);

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
         Log.error("Rewind Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);   

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            components: [ disabledButtons],
            position: 'end'
         });
      }
   }
}