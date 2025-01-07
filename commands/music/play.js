const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonStyle } = require('discord.js');

const { getServerData, setGlobalVariable }  = require('../../global.js');

const { createButton } = require('../../helpers/createButton.js');
const { testLink } = require('../../helpers/testLink.js');
const { errorEmbed } = require('../../helpers/embeds.js');
const { processTitleSong } = require('../../helpers/processTitleSong.js');
const { playNextSong } = require('../../helpers/playNextSong.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { handlePlayerIdle } = require('../../helpers/handlePlayerIdle.js');
const { processUrlSong } = require('../../helpers/processUrlSong.js');
const Log = require('../../helpers/fancyLogs/log.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play song from YouTube')
        .addStringOption(option => option
            .setName('query')
            .setDescription('Song name, YouTube URL or Spotify URL')
            .setRequired(true)
        ),

    async execute(interaction) 
    {
        if(getServerData(interaction.guild.id).firstCommandTimestamp == null)
        {
            setGlobalVariable(interaction.guild.id, 'firstCommandTimestamp', Date.now());
        }
        
        await interaction.deferReply();

        const playingRow = new ActionRowBuilder();
        const pausedRow = new ActionRowBuilder();
        const disabledButtons = new ActionRowBuilder();

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

        const query = await interaction.options.getString('query');

        const song = testLink(query, interaction);
       
        const voiceChannel = await interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.editReply({ embeds: [errorEmbed("You need to be in a voice channel to play music")]});
            return;
        }

        if (!query) {
            await interaction.editReply({ embeds: [errorEmbed("Please provide a song name, YouTube URL or Spotify URL")]});
            return;
        }
        
        setGlobalVariable(interaction.guild.id, 'commandChannel', interaction.channel);

        if(song.type === "link")
            await processUrlSong(song.query, interaction);
        
        if(song.type === "title")
            await processTitleSong(song.query, interaction);

        Log.info("Checking if queue is empty", null, interaction.guild.id, interaction.guild.name);

        if(getServerData(interaction.guild.id).queue.length >= 1)
        {
            try
            {
                let player;
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                
                if(!connection)
                {
                    Log.error("Error joining voice channel", null, interaction.guild.id, interaction.guild.name);
                    return;
                }
    
                if(getServerData(interaction.guild.id).player == null)
                {
                    player = createAudioPlayer();
                    setGlobalVariable(interaction.guild.id, "player", player);
                }

                try
                {
                    handlePlayerIdle(interaction, connection, pausedRow, playingRow, disabledButtons);
                
                    if(getServerData(interaction.guild.id).player.state.status === AudioPlayerStatus.Playing)
                    {
                        Log.info("Player is playing", null, interaction.guild.id, interaction.guild.name);
                        return;    
                    }
                    else if(getServerData(interaction.guild.id).player.state.status === AudioPlayerStatus.Paused)
                    {
                        Log.info("Player is paused", null, interaction.guild.id, interaction.guild.name);
                        return;
                    }
                    else 
                    {
                        try 
                        {
                            Log.info("Playing first song", null, interaction.guild.id, interaction.guild.name); 
                            clearTimeout(getServerData(interaction.guild.id).timeout);
                            Log.info("Timeout for clearing variables and disconnecting stopped", null, interaction.guild.id, interaction.guild.name);
                            playNextSong(interaction, connection, pausedRow, playingRow, disabledButtons);
                        }
                        catch(error)
                        {
                            Log.error("Error playing song", error, interaction.guild.id, interaction.guild.name);
                        }
                    }
                }
                catch(error)
                {
                    Log.error("Error handling player idle:", error, interaction.guild.id, interaction.guild.name);
                }
            }
            catch(error)
            {
                Log.error("Error joining voice channel or setting up player:", error, interaction.guild.id, interaction.guild.name);
            }
        }
    }    
}
