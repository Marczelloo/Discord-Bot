const { bassBoost, bassBoostV2, earrape, nightcore, slowReverb, eightBit, dolbyRetardos, inverted, toiletAtClub } = require("./eqFunctions");

module.exports = {
   applyEqualizer: async function() {
      console.log("Applying EQ effect: " + eq);
      let outputFilePath;
      switch(eq)
      {
            case 'bassboost':
               await bassBoost();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";
               break;
            case 'bass-v2':
               await bassBoostV2();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case 'earrape':
               await earrape();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case 'nightcore':
               await nightcore();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case 'slowReverb':
               await slowReverb();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case 'eightBit':
               await eightBit();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case "dolbyRetardos":
               await dolbyRetardos();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case "inverted":
               await inverted();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            case "toiletAtClub":
               await toiletAtClub();
               outputFilePath = __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg";               break;
            default:
               break;
      }
      console.log("EQ effect applied");

      return outputFilePath;
   }
}