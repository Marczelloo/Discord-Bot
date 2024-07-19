const { bassBoost, bassBoostV2, earrape, nightcore, slowReverb, eightBit, dolbyRetardos, inverted, toiletAtClub } = require("./eqFunctions");
const Log = require("./fancyLogs/log");

module.exports = {
   applyEqualizer: async function(interaction, eq) {
      Log.info("Apply Equalizer", eq, interaction.guild.id, interaction.guild.name);
      let outputFilePath;
      switch(eq)
      {
            case 'bassboost':
               await bassBoost(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";
               break;
            case 'bass-v2':
               await bassBoostV2(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case 'earrape':
               await earrape(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case 'nightcore':
               await nightcore(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case 'slowReverb':
               await slowReverb(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case 'eightBit':
               await eightBit(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case "dolbyRetardos":
               await dolbyRetardos(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case "inverted":
               await inverted(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            case "toiletAtClub":
               await toiletAtClub(interaction);
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               
               break;
            default:
               Log.error("Invalid equalizer", null, interaction.guild.id, interaction.guild.name);
               break;
      }
      Log.info("Equalizer effect applied", null, interaction.guild.id, interaction.guild.name);

      return outputFilePath;
   }
}