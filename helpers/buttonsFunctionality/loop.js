const { getServerData, LoopType, setGlobalVariable } = require("../../global");
const Log = require("../fancyLogs/log");

module.exports = {
   loop: async function(interaction, 
      confirmation, 
      nowPlayingEmbed, 
      nowPlayingEmbedFields) {
      Log.info("Loop button clicked", null, interaction.guild.id, interaction.guild.name);
      if(getServerData(interaction.guild.id).autoplay)
      {
         await confirmation.channel.send({ embeds: [errorEmbed("You can't toggle loop while autoplay is active!")]});
         return;
      }

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
      Log.info("Loop set to: " + getServerData(interaction.guild.id).loop, null, interaction.guild.id, interaction.guild.name);

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
         Log.error("Loop Button Error updating message: ", error, interaction.guild.id, interaction.guild.name);

         await getServerData(interaction.guild.id).playerMessage.edit({
            embeds: [ nowPlayingEmbed],
            position: 'end'
         });
      }
   }
}