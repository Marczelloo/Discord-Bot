const { setGlobalVariable, getServerData, unshiftQueue } = require("../../global");

module.exports = {
   shuffle: async function(interaction, confirmation, nowPlayingEmbedFields, nowPlayingEmbed) {
      console.log("Shuffle button clicked. Shuffling the queue");
      setGlobalVariable(interaction.guild.id, "shuffle", !getServerData(interaction.guild.id).shuffle);

      if(getServerData(interaction.guild.id).shuffle)
      {
         setGlobalVariable(interaction.guild.id, "originalQueue", getServerData(interaction.guild.id).queue);
         const firstSong = getServerData(interaction.guild.id).queue.shift();
         setGlobalVariable(interaction.guild.id, "queue", getServerData(interaction.guild.id).queue.sort(() => Math.random() - 0.5));
         unshiftQueue(interaction.guild.id, firstSong);
      }
      else
      {
         setGlobalVariable(interaction.guild.id, "queue", getServerData(interaction.guild.id).originalQueue);
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
         console.error("Error updating message: " + error);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [nowPlayingEmbed],
            position: 'end'
         });
      }
   }
}