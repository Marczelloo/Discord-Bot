const { getServerData, LoopType, addToQueue, unshiftQueue, shiftQueue, setGlobalVariable } = require("../global");

module.exports = {
   handleIdleLoop: function(interaction) {
      const loopType = getServerData(interaction.guild.id).loopType
      console.log("Loop type: " + loopType);
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
      console.log("Timeout for clearing variables and disconnecting stopped");
   }
}