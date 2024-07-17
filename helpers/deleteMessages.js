const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable, clearGlobalVariables } = require("../global")

module.exports = {
   deleteMessages: async function(interaction, connection) {
      getServerData(interaction.guild.id).commandChannel.messages.fetch(getServerData(interaction.guild.id).nowPlayingMessage)
      .then(message => {
         if(message) message.delete();
      })
      .catch(error => {
         console.error("Error deleting message: " + error);
      })

      getServerData(interaction.guild.id).commandChannel.messages.fetch({ limit: 100})
      .then(async messages => {
         const botMessages = await messages.filter(m => m.author.bot && (messages.createdTimestamp > getServerData(interaction.guild.id).firstCommandTimestamp));

         getServerData(interaction.guild.id).commandChannel.bulkDelete(botMessages, true)
         .then(() => {
            console.log("Messages deleted");
         })
         .catch(error => {
            console.error("Error deleting messages: " + error);
         })
      })
      .catch(error => {
         console.error("Error fetching messages: " + error);
      })

      setGlobalVariable(interaction.guild.id, "timeout", setTimeout(() => {
         console.log("End of timeout");
         if(getServerData(interaction.guild.id).queue.length === 0 && getServerData(interaction.guild.id).player.state.status === AudioPlayerStatus.Idle)
         {
            console.log("Disconnecting from voice channel after timeout");

            connection.disconnect();
            clearGlobalVariables(interaction.guild.id);
         }
      }, 300000));
   }
}