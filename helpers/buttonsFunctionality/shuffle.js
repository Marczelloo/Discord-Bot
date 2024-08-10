const { setGlobalVariable, getServerData, unshiftQueue, QueueType } = require("../../global");
const Log = require("../fancyLogs/log");

module.exports = {
   shuffle: async function(interaction, 
      confirmation, 
      nowPlayingEmbedFields, 
      nowPlayingEmbed) {
      Log.info("Shuffle button clicked", null, interaction.guild.id, interaction.guild.name);
      setGlobalVariable(interaction.guild.id, "shuffle", !getServerData(interaction.guild.id).shuffle);

      if(getServerData(interaction.guild.id).shuffle)
      {
         setGlobalVariable(interaction.guild.id, "originalQueue", getServerData(interaction.guild.id).queue);
         const firstSong = getServerData(interaction.guild.id).queue.shift();
         setGlobalVariable(interaction.guild.id, "queue", getServerData(interaction.guild.id).queue.sort(() => Math.random() - 0.5));
         unshiftQueue(interaction.guild.id, QueueType.QUEUE, firstSong);
         Log.info("Queue shuffled", null, interaction.guild.id, interaction.guild.name);
      }
      else
      {
         setGlobalVariable(interaction.guild.id, "queue", getServerData(interaction.guild.id).originalQueue);
         Log.info("Queue unshuffled", null, interaction.guild.id, interaction.guild.name);
      }

      nowPlayingEmbedFields[5].value = getServerData(interaction.guild.id).shuffle ? 'Shuffled' : 'Not shuffled';
      nowPlayingEmbed.setFields(nowPlayingEmbedFields);

      try
      {
         await confirmation.update({
            embeds: [nowPlayingEmbed],
            position: 'end'
         })
      }
      catch(error)
      {
         Log.error("Shuffle Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);  

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [nowPlayingEmbed],
            position: 'end'
         });
      }
   }
}