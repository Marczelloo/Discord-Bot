const { getServerData, LoopType, addToQueue, unshiftQueue, shiftQueue, setGlobalVariable, QueueType } = require("../global");
const Log = require("./fancyLogs/log");

module.exports = {
   handleIdleLoop: function(interaction) {
      const loopType = getServerData(interaction.guild.id).loop
      Log.info("Handling idle loop", null, interaction.guild.id, interaction.guild.name);
      Log.info("Loop type: ", loopType, interaction.guild.id, interaction.guild.name);
      switch(loopType)
      {
         case LoopType.LOOP_QUEUE:
            addToQueue(interaction.guild.id, getServerData(interaction.guild.id).queue[0], QueueType.QUEUE);
            unshiftQueue(interaction.guild.id, QueueType.PLAYED_SONGS, getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, QueueType.QUEUE);
            break;
         case LoopType.LOOP_SONG:
            unshiftQueue(interaction.guild.id, QueueType.QUEUE, getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, QueueType.QUEUE);
            break;
         case LoopType.NO_LOOP:
            unshiftQueue(interaction.guild.id, QueueType.PLAYED_SONGS, getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, QueueType.QUEUE);
            setGlobalVariable(interaction.guild.id, QueueType.ORIGINAL_QUEUE, getServerData(interaction.guild.id).originalQueue.filter(song => song !== getServerData(interaction.guild.id).queue[0]));
            break;
         default:
            unshiftQueue(interaction.guild.id, QueueType.PLAYED_SONGS, getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, QueueType.QUEUE);
            setGlobalVariable(interaction.guild.id, QueueType.ORIGINAL_QUEUE, getServerData(interaction.guild.id).originalQueue.filter(song => song !== getServerData(interaction.guild.id).queue[0]));
            break;
      }
      clearTimeout(getServerData(interaction.guild.id).timeout);
      Log.info("Timeout for clearing variables and disconnecting cleared", null, interaction.guild.id, interaction.guild.name);
   }
}