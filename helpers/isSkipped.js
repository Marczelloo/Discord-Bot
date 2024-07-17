const { setGlobalVariable, unshiftQueue, getServerData, shiftQueue } = require("../global");
const { handleIdleLoop } = require("./handleIdleLoop");

function isSkipped(interaction) {
   const { playNextSong } = require("./playNextSong");

   console.log("Player idle");
   setGlobalVariable(interaction.guild.id, "isSkipped", true);

   if(getServerData(interaction.guild.id).playEarlier)
   {
      console.log("Playing earlier song");
      setGlobalVariable(interaction.guild.id, "playEarlier", false);
      unshiftQueue(interaction.guild.id, "playedSongs", getServerData(interaction.guild.id).playedSongs[0]);
      clearTimeout(getServerData(interaction.guild.id).timeout);
      console.log("Timeout for clearing variables and discoennecting stopped");
      shiftQueue(interaction.guild.id, "playedSongs");
   }
   else
   {
      handleIdleLoop(interaction);
   }

   if(getServerData(interaction.guild.id).queue.length === 0)
   {
      setGlobalVariable(interaction.guild.id, "nowPlayingMessage", null);
      setGlobalVariable(interaction.guild.id, "firstCommandTimestamp", null);

      console.log("Queue is empty, disconnecting, claering variales and deleting messages");

      deleteMessages(interaction, connection);
   }
   else if(getServerData(interaction.guild.id).playEarlier)
   {
      console.log("Playing earlier song");;
      clearTimeout(getServerData(interaction.guild.id).timeout);
      console.log("Timeout for clearing variables and disconnecting stopped");
      setGlobalVariable(interaction.guild.id, "playEarlier", false);
      playNextSong(interaction, connection);
   }
}

exports.isSkipped = isSkipped;
