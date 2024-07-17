const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, setGlobalVariable } = require("../global");

module.exports = {
   updateNowPlayingMessage: async function(interaction,
      nowPlayingEmbed, 
      playingRow, 
      pausedRow) {
         
      console.log(playingRow);
      console.log(pausedRow);
      console.log("Now playing message exists, updating it");
      await interaction.channel.messages.fetch(getServerData(interaction.guild.id).nowPlayingMessage)
      .then(async message => {
         if (message) message.delete().catch(console.error);

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
                  setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
                  setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
               })
               .cactch(console.error))
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
                  setGlobalVariable(interaction.guild.id, "nowPlayingMessage", nowPlayingMessage.id);
                  setGlobalVariable(interaction.guild.id, "playerMessage", nowPlayingMessage)
               })
               .catch(console.error))
            }
         }
         catch(error)
         {
            if(error.code === 10008)
            {
               console.error("The message has already been deleted or does not exist.");
            }
            else
            {
               console.error("Error updating now playing message: " + error);
            }
         }
      })
      .catch(error => {
         if(error.code === 10008)
         {
            console.error("The message has already been deleted or does not exist.");
         }
      })
      .catch(console.error);
   }
}