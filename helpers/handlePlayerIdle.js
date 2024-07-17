const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable } = require("../global");

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

      if (!getServerData(interaction.guild.id).player) {
         console.error("Player not found in server data");
         return;
      }

      getServerData(interaction.guild.id).player.on('stateChange', (oldState, newState) => {
         console.log(`Player state changed from ${oldState.status} to ${newState.status}`);
      });

      getServerData(interaction.guild.id).player.on('idle', async () => {
         console.log("Player is idle");
         if(getServerData(interaction.guild.id).schedulerPlaying)
         {
            console.log("Scheduler is playing.");
            setGlobalVariable(interaction.guild.id, "schedulerPlaying", false);
            clearTimeout(getServerData(interaction.guild.id).timeout);
            console.log("Timeout for clearing variables and disconnecting stopped");
            playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
            return;
         }

         if(getServerData(interaction.guild.id).autoPlay)
         {
            console.log("Autoplay is enabled");
            await autoplay(interaction);
         }

         if(!getServerData(interaction.guild.id).isSkipped)
         {
            console.log("Player is not skipped");
            isSkipped(interaction, connection);
         }

         if(getServerData(interaction.guild.id).player.state.status === AudioPlayerStatus.Playing)
         {
            console.log("Player is playing");
            return;
         }
         else
         {
            if(getServerData(interaction.guild.id).queue.length === 0) return;

            console.log("Playing first song");
            clearTimeout(getServerData(interaction.guild.id).timeout);
            console.log("Timeout for clearing variables and disconnecting stopped");
            playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
         }
      });
   }
   catch(error)
   {
      console.error("Error handling player idle: " + error);
      return;
   }
}


exports.handlePlayerIdle = handlePlayerIdle;