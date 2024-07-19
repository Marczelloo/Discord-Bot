const { getServerData } = require("../global");
const { rewind } = require("./buttonsFunctionality/rewind");
const { skip } = require("./buttonsFunctionality/skip");
const { pause } = require("./buttonsFunctionality/pause");
const { resume } = require("./buttonsFunctionality/resume");
const { loop } = require("./buttonsFunctionality/loop");
const { shuffle } = require("./buttonsFunctionality/shuffle");
const Log = require("./fancyLogs/log");

module.exports = {
   buttonFunctionality: async function(interaction, nowPlayingEmbedFields, 
   nowPlayingEmbed,
   playingRow,
   pausedRow,
   disabledButtons) {
      const filter = () => true;
      try
      {
         let collector;
         try
         {
            collector = await getServerData(interaction.guild.id).playerMessage.createMessageComponentCollector({ filter, time: null});
         }
         catch(error)
         {
            Log.error("Error creating collector: ", error, interaction.guild.id, interaction.guild.name);

            collector = getServerData(interaction.guild.id).commandChannel.createMessageComponentCollector({ filter, time: null });
         }

         collector.on('collect', async (confirmation) => {
            switch(confirmation.customId)
            {
               case 'rewind-button':
                  rewind(interaction, confirmation, collector, nowPlayingEmbedFields, nowPlayingEmbed, disabledButtons);
                  break;
               case 'skip-button':
                  skip(interaction, confirmation, collector, nowPlayingEmbedFields, nowPlayingEmbed, disabledButtons);
                  break;
               case 'pause-button':
                  pause(interaction, confirmation, nowPlayingEmbedFields, nowPlayingEmbed, pausedRow);
                  break;
               case 'resume-button':
                  resume(interaction, confirmation, nowPlayingEmbedFields, nowPlayingEmbed, playingRow);
                  break;
               case 'loop-button':
                  loop(interaction, confirmation, nowPlayingEmbedFields, nowPlayingEmbed);
                  break;
               case 'shuffle-button':
                  shuffle(interaction, confirmation, nowPlayingEmbedFields, nowPlayingEmbed);
                  break;
               default:
                  Log.error("Invalid customId", null, interaction.guild.id, interaction.guild.name);
                  break;
            }
         })
      }
      catch(error)
      {
         Log.error("Interaction collector error: ", error, interaction.guild.id, interaction.guild.name);
      }
   }
}