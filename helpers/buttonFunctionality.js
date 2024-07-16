const { getServerData } = require("../global");

module.exports = {
   buttonFunctionality: async function(interaction, button) {
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
            console.error("Error creating collector: ");
            console.error(e);

            collector = getServerData(interaction.guild.id).commandChannel.createMessageComponentCollector({ filter, time: null });
         }

         collector.on('collect', async (confirmation) => {
            switch(confirmation.customId)
            {
               case 'rewind-button':
                  rewind();
                  break;
               case 'skip-button':
                  skip();
                  break;
               case 'pause-button':
                  pause();
                  break;
               case 'resume-button':
                  resume();
                  break;
               case 'loop-button':
                  loop();
                  break;
               case 'shuffle-button':
                  shuffle();
                  break;
               default:
                  console.error("Invalid customId");
                  break;
            }
         })
      }
      catch(error)
      {
         console.error(error);
      }
   }
}