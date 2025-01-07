const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable } = require("../global");
const Log = require("./fancyLogs/log");

async function handlePlayerIdle(interaction, 
   connection,
   pausedRow,
   playingRow,
   disabledButtons) {
   const { autoplay } = require("./autoplay");
   const { playNextSong }= require("./playNextSong");
   const { isSkipped } = require("./isSkipped");

   try
   {
      const player = getServerData(interaction.guild.id).player;

      if (!player) {
         Log.error("Player not found in server data", null, interaction.guild.id, interaction.guild.name);
         return;
      }

      if (player.listenerCount('stateChange') > 0 || player.listenerCount('idle') > 0) {
         Log.info("Player already has event listeners attached", null, interaction.guild.id, interaction.guild.name);
         return;
      }

      player.on('stateChange', (oldState, newState) => {
         Log.info(`Player state changed from ${oldState.status} to ${newState.status}`, null, interaction.guild.id, interaction.guild.name);
      });

      player.on('idle', async () => {
         Log.info("Player is idle", null, interaction.guild.id, interaction.guild.name);
         if(getServerData(interaction.guild.id).schedulerPlaying)
         {
            Log.info("Scheduler is playing", null, interaction.guild.id, interaction.guild.name);
            setGlobalVariable(interaction.guild.id, "schedulerPlaying", false);
            clearTimeout(getServerData(interaction.guild.id).timeout);
            Log.info("Timeout for clearing variables and disconnecting stopped", null, interaction.guild.id, interaction.guild.name);
            playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
            return;
         }

         if(getServerData(interaction.guild.id).autoPlay)
         {
            await autoplay(interaction);
         }

         if(!getServerData(interaction.guild.id).isSkipped)
         {
            isSkipped(interaction, connection);
         }

         if(player.state.status === AudioPlayerStatus.Playing)
         {
            Log.info("Player is playing", null, interaction.guild.id, interaction.guild.name);
            return;
         }
         else
         {
            if(getServerData(interaction.guild.id).queue.length === 0) return;

            Log.info("Playing first song", null, interaction.guild.id, interaction.guild.name);
            clearTimeout(getServerData(interaction.guild.id).timeout);
            Log.info("Timeout for clearing variables and disconnecting stopped", null, interaction.guild.id, interaction.guild.name);
            playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
         }
      });
   }
   catch(error)
   {
      Log.error("Error handling player idle: ", error, interaction.guild.id, interaction.guild.name);
   }
}

exports.handlePlayerIdle = handlePlayerIdle;