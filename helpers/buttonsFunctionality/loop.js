const { getServerData, LoopType, setGlobalVariable } = require("../../global");

module.exports = {
   loop: async function(interaction, confirmation, nowPlayingEmbed, nowPlayingEmbedFields) {
      if(getServerData(interaction.guild.id).autoplay)
      {
         await confirmation.channel.send({ embeds: [errorEmbed("You can't toggle loop while autoplay is active!")]});
         return;
      }

      console.log("Loop button clicked. Changing loop type");
      if(getServerData(interaction.guild.id).loop === LoopType.NO_LOOP)
      {
         setGlobalVariable(interaction.guild.id, "loop", LoopType.LOOP_SONG);
      }
      else if(getServerData(interaction.guild.id).loop === LoopType.LOOP_SONG)
      {
         setGlobalVariable(interaction.guild.id, "loop", LoopType.LOOP_QUEUE);
      }
      else if(getServerData(interaction.guild.id).loop === LoopType.LOOP_QUEUE)
      {
         setGlobalVariable(interaction.guild.id, "loop", LoopType.NO_LOOP);
      }

      nowPlayingEmbedFields[2].value = getServerData(interaction.guild.id).loop === LoopType.NO_LOOP ? 'No loop' : getServerData(interaction.guild.id).loop === LoopType.LOOP_SONG ? 'Loop song' : 'Loop queue';
      nowPlayingEmbed.setFields(nowPlayingEmbedFields);

      try 
      {
         await confirmation.update({ 
            embeds: [ nowPlayingEmbed ],
            position: 'end'
         });
      }
      catch(error)
      {
         console.error("Error updating message: " + error);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            position: 'end'
         });
      }
   }
}