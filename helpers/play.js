const { getServerData, setGlobalVariable } = require("../global");
const { sendNowPlayingMessage } = require("./sendNowPlayingMessage");
const { updateNowPlayingMessage } = require("./updateNowPlayingMessage");
const { buttonFunctionality } = require("./buttonFunctionality");
const { createAudioResource, StreamType } = require("@discordjs/voice");
const { createButton } = require("./createButton");
const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder } = require("@discordjs/builders");
const Log = require("./fancyLogs/log");

async function play(interaction, 
   outputFilePath, 
   connection, 
   nowPlayingEmbed, 
   nowPlayingEmbedFields,
   playingRow,
   pausedRow,
   disabledButtons) {

   Log.info("Play command", null, interaction.guild.id, interaction.guild.name);

   const eq = getServerData(interaction.guild.id).eqEffect;

   if(eq)
      outputFilePath = applyEqualizer(interaction, eq)

   const resource = createAudioResource(outputFilePath, { inputType: StreamType.OggOpus, inlineVolume: true });
   resource.volume.setVolume(0.05);

   setGlobalVariable(interaction.guild.id, "resource", resource);
   getServerData(interaction.guild.id).player.play(resource);
   connection.subscribe(getServerData(interaction.guild.id).player);
   setGlobalVariable(interaction.guild.id, "isSkipped", false);

   nowPlayingEmbedFields[1].value = "Playing";
   nowPlayingEmbedFields[3].value = (getServerData(interaction.guild.id).resource.volume.volume * 100).toString();
   nowPlayingEmbed.addFields(nowPlayingEmbedFields);

   if(!pausedRow || !playingRow || !disabledButtons)
   {
      playingRow = new ActionRowBuilder();
      pausedRow = new ActionRowBuilder();
      disabledButtons = new ActionRowBuilder();

      const skipButton = createButton('skip-button', ButtonStyle.Secondary, '1198248590087307385');
        const disabledSkipButton = createButton('skip-button', ButtonStyle.Secondary, '1198248590087307385', true);
        const rewindButton = createButton('rewind-button', ButtonStyle.Secondary, '1198248587369386134');
        const disabledRewindButton = createButton('rewind-button', ButtonStyle.Secondary, '1198248587369386134', true);
        const pauseButton = createButton('pause-button', ButtonStyle.Danger, '1198248585624571904');
        const disabledPauseButton = createButton('pause-button', ButtonStyle.Danger, '1198248585624571904', true);
        const resumeButton = createButton('resume-button', ButtonStyle.Success, '1198248583162511430');
        const loopButton = createButton('loop-button', ButtonStyle.Primary, '1198248581304418396');
        const disabledLoopButton = createButton('loop-button', ButtonStyle.Primary, '1198248581304418396', true);
        const shuffleButton = createButton('shuffle-button', ButtonStyle.Primary, '1198248578146115605')
        const disabledshuffleButton = createButton('shuffle-button', ButtonStyle.Primary, '1198248578146115605', true);
        
        playingRow.addComponents([rewindButton, skipButton, pauseButton, loopButton, shuffleButton]);
        pausedRow.addComponents([rewindButton, skipButton, resumeButton, loopButton, shuffleButton]);
        disabledButtons.addComponents([disabledRewindButton, disabledSkipButton, disabledPauseButton, disabledLoopButton, disabledshuffleButton]);
   }

   if(getServerData(interaction.guild.id).nowPlayingMessage)
   {
      await updateNowPlayingMessage(interaction, nowPlayingEmbed, playingRow, pausedRow);
   }
   else 
   {
      await sendNowPlayingMessage(interaction, nowPlayingEmbed, playingRow, pausedRow);
   }

   await buttonFunctionality(interaction, nowPlayingEmbedFields, nowPlayingEmbed, playingRow, pausedRow, disabledButtons);
}

exports.play = play;