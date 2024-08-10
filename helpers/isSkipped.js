const { setGlobalVariable, unshiftQueue, getServerData, shiftQueue, QueueType } = require("../global");
const { deleteMessages } = require("./deleteMessages");
const Log = require("./fancyLogs/log");
const { handleIdleLoop } = require("./handleIdleLoop");

function isSkipped(interaction, connection) {
   const { playNextSong } = require("./playNextSong");

   Log.info("Player is idle", null, interaction.guild.id, interaction.guild.name);
   setGlobalVariable(interaction.guild.id, "isSkipped", true);

   if(getServerData(interaction.guild.id).playEarlier)
   {
      Log.info("Playing earlier song", null, interaction.guild.id, interaction.guild.name);
      setGlobalVariable(interaction.guild.id, "playEarlier", false);
      unshiftQueue(interaction.guild.id, QueueType.PLAYED_SONGS, getServerData(interaction.guild.id).playedSongs[0]);
      clearTimeout(getServerData(interaction.guild.id).timeout);
      Log.info("Timeout for clearing variables and disconnecting stopped", null, interaction.guild.id, interaction.guild.name);
      shiftQueue(interaction.guild.id, QueueType.PLAYED_SONGS);
   }
   else
   {
      handleIdleLoop(interaction);
   }

   if(getServerData(interaction.guild.id).queue.length === 0)
   {
      setGlobalVariable(interaction.guild.id, "nowPlayingMessage", null);
      setGlobalVariable(interaction.guild.id, "firstCommandTimestamp", null);

      Log.info("Queue is empty, disconnecting, clearing variables and deleting messages", null, interaction.guild.id, interaction.guild.name);

      deleteMessages(interaction, connection);
   }
   else if(getServerData(interaction.guild.id).playEarlier)
   {
      Log.info("Playing earlier song", null, interaction.guild.id, interaction.guild.name);
      clearTimeout(getServerData(interaction.guild.id).timeout);
      Log.info("Timeout for clearing variables and disconnecting stopped", null, interaction.guild.id, interaction.guild.name);
      setGlobalVariable(interaction.guild.id, "playEarlier", false);
      playNextSong(interaction, connection);
   }
}

exports.isSkipped = isSkipped;
