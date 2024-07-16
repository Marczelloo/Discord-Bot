const { bassBoost, bassBoostV2, earrape, nightcore, slowReverb, eightBit, dolbyRetardos, inverted, toiletAtClub } = require("../commands/music/eqFunctions");

module.exports = {
   applyEqualizer: async function() {
      console.log("Applying EQ effect: " + eq);
      let outputFilePath;
      switch(eq)
      {
            case 'bassboost':
               await bassBoost();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case 'bass-v2':
               await bassBoostV2();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case 'earrape':
               await earrape();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case 'nightcore':
               await nightcore();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case 'slowReverb':
               await slowReverb();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case 'eightBit':
               await eightBit();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case "dolbyRetardos":
               await dolbyRetardos();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case "inverted":
               await inverted();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            case "toiletAtClub":
               await toiletAtClub();
               outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
               break;
            default:
               break;
      }
      console.log("EQ effect applied");

      return outputFilePath;
   }
}