const { getServerData, setGlobalVariable } = require("../global");
const buttonFunctionality = require("./buttonFunctionality");
const sendNowPlayingMessage = require("./sendNowPlayingMessage");
const updateNowPlayingMessage = require("./updateNowPlayingMessage");

module.exports = {
   play: async function (interaction, outputFilePath, connection, nowPlayingEmbed, nowPlayingEmbedFields) {
      const eq = getServerData(interaction.guild.id).eqEffect;

      if(eq)
         outputFilePath = applyEqualizer()

      const resource = createAudioResource(outputFilePath, { inputType: StreamType.OggOpus, inlineVolume: true });
      resource.volume.setVolume(0.05);

      setGlobalVariable(interaction.guild.id, "resource", resource);
      getServerData(interaction.guild.id).player.play(resource);
      connection.subscribe(getServerData(interaction.guild.id).player);
      setGlobalVariable(interaction.guild.id, "isSkipped", false);

      nowPlayingEmbedFields[1].value = "Playing";
      nowPlayingEmbedFields[3].value = (globals.resource.volume.volume * 100).toString();
      nowPlayingEmbed.addFields(nowPlayingEmbedFields);

      if(getServerData(interaction.guild.id).nowPlayingMessage)
      {
         updateNowPlayingMessage(interaction, nowPlayingEmbed, playingRow, pausedRow);
      }
      else 
      {
         sendNowPlayingMessage(interaction, nowPlayingEmbed, playingRow, pausedRow);
      }

      buttonFunctionality();

   }
}