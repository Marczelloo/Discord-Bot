const { getServerData, LoopType, addToQueue, unshiftQueue, shiftQueue, setGlobalVariable } = require("../global");
const Log = require("./fancyLogs/log");

module.exports = {
   handleIdleLoop: function(interaction) {
      const loopType = getServerData(interaction.guild.id).loop
      Log.info("Handling idle loop", null, interaction.guild.id, interaction.guild.name);
      Log.info("Loop type: ", loopType, interaction.guild.id, interaction.guild.name);
      switch(loopType)
      {
         case LoopType.LOOP_QUEUE:
            addToQueue(interaction.guild.id, getServerData(interaction.guild.id).playedSongs[0]);
            unshiftQueue(interaction.guild.id, "playedSongs", getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, "queue");
            break;
         case LoopType.LOOP_SONG:
            unshiftQueue(interaction.guild.id, "queue", getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, "queue");
            break;
         case LoopType.NO_LOOP:
            unshiftQueue(interaction.guild.id, "playedSongs", getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, "queue");
            setGlobalVariable(interaction.guild.id, "originalQueue", getServerData(interaction.guild.id).originalQueue.filter(song => song !== getServerData(interaction.guild.id).queue[0]));
            break;
         default:
            unshiftQueue(interaction.guild.id, "playedSongs", getServerData(interaction.guild.id).queue[0]);
            shiftQueue(interaction.guild.id, "queue");
            setGlobalVariable(interaction.guild.id, "originalQueue", getServerData(interaction.guild.id).originalQueue.filter(song => song !== getServerData(interaction.guild.id).queue[0]));
            break;
      }
      clearTimeout(getServerData(interaction.guild.id).timeout);
      Log.info("Timeout for clearing variables and disconnecting cleared", null, interaction.guild.id, interaction.guild.name);
   }
}