const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable, clearGlobalVariables } = require("../global");
const Log = require("./fancyLogs/log");

module.exports = {
   deleteMessages: async function(interaction, connection) {
      getServerData(interaction.guild.id).commandChannel.messages.fetch(getServerData(interaction.guild.id).nowPlayingMessage)
      .then(message => {
         if(message) message.delete();
      })
      .catch(error => {
         Log.error("Error deleting message: ", error, interaction.guild.id, interaction.guild.name);
      })

      getServerData(interaction.guild.id).commandChannel.messages.fetch({ limit: 100})
      .then(async messages => {
         const botMessages = await messages.filter(m => m.author.bot && (messages.createdTimestamp > getServerData(interaction.guild.id).firstCommandTimestamp));

         getServerData(interaction.guild.id).commandChannel.bulkDelete(botMessages, true)
         .then(() => {
            Log.info("Messages deleted", null, interaction.guild.id, interaction.guild.name);
         })
         .catch(error => {
            Log.error("Error deleting messages: ", error, interaction.guild.id, interaction.guild.name);
         })
      })
      .catch(error => {
         Log.error("Error fetching messages: ", error, interaction.guild.id, interaction.guild.name);
      })

      setGlobalVariable(interaction.guild.id, "timeout", setTimeout(() => {
         Log.info("Timeout reached", null, interaction.guild.id, interaction.guild.name);
         if(getServerData(interaction.guild.id).queue.length === 0 && getServerData(interaction.guild.id).player.state.status === AudioPlayerStatus.Idle)
         {
            Log.info("Disconnecting from voice channel after timeout", null, interaction.guild.id, interaction.guild.name);

            connection.disconnect();
            clearGlobalVariables(interaction.guild.id);
         }
      }, 300000));
   }
}