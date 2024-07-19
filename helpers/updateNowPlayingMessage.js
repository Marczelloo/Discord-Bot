const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable } = require("../global");
const Log = require("./fancyLogs/log");

module.exports = {
   updateNowPlayingMessage: async function(interaction,
      nowPlayingEmbed, 
      playingRow, 
      pausedRow) {
         
      Log.info("Updating now playing message", null, interaction.guild.id, interaction.guild.name);
      await interaction.channel.messages.fetch(getServerData(interaction.guild.id).nowPlayingMessage)
      .then(async message => {
         if (message) message.delete().catch(error => {
            if(error.code === 10008)
            {
               Log.error("The message has already been deleted or does not exist.", error, interaction.guild.id, interaction.guild.name);
            }
            else
            {
               Log.error("Error deleting now playing message: ", error, interaction.guild.id, interaction.guild.name);
            }
         });

         try
         {
            if(getServerData(interaction.guild.id).player.AudioPlayerStatus === AudioPlayerStatus.Paused)
            {
               setGlobalVariable(interaction.guild.id, "coll", 
               await interaction.channel.send({
                  embeds: [ nowPlayingEmbed ],
                  components: [ pausedRow ],
                  position: 'end'
               })
               .then(nowPlayingMessage => {
                  Log.success("Now playing message updated", null, interaction.guild.id, interaction.guild.name);
                  setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
                  setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
               })
               .cactch(error => {
                  Log.error("Error updating paused message: ", error, interaction.guild.id, interaction.guild.name);
               }))
            }
            else
            {
               setGlobalVariable(interaction.guild.id, "coll", 
               await interaction.channel.send({
                  embeds: [ nowPlayingEmbed ],
                  components: [ playingRow ],
                  position: 'end'
               })
               .then(nowPlayingMessage => {
                  Log.success("Now playing message updated", null, interaction.guild.id, interaction.guild.name);
                  setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
                  setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
               })
               .catch(error => {
                  Log.error("Error updating playing message: ", error, interaction.guild.id, interaction.guild.name);
               }))
            }
         }
         catch(error)
         {
            if(error.code === 10008)
            {
               Log.error("The message has already been deleted or does not exist.", error, interaction.guild.id, interaction.guild.name);
            }
            else
            {
               Log.error("Error updating now playing message: ", error, interaction.guild.id, interaction.guild.name);
            }
         }
      })
      .catch(error => {
         if(error.code === 10008)
         {
            Log.error("The message has already been deleted or does not exist.", error, interaction.guild.id, interaction.guild.name);
         }
      })
      .catch(error => {
         Log.error("Error fetching now playing message: ", error, interaction.guild.id, interaction.guild.name);
      });
   }
}