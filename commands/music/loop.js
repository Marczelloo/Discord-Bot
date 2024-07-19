const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, setGlobalVariable, LoopType, getClient } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');
const Log = require('../../helpers/fancyLogs/log.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Type of loop')
            .setRequired(true)
            .addChoices(
                { name: 'Loop song', value: 'loop song'},
                { name: 'Loop queue', value: 'loop queue' },
                { name: 'Disable loop', value: 'no loop' }
            )
        ),
    
    async execute(interaction)
    {
        try
        {
            const botMember = await guild.members.fetch(getClient().user.id);
            const botVoiceChannel = botMember.voice.channel;
    
            const memberVoiceChannel = interaction.member.voice.channel;
        
            if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
            {
                interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to loop song!")] });
                return;           
            }
    
            if(getServerData(interaction.guild.id).player == null || getServerData(interaction.guild.id).player.state.status !== AudioPlayerStatus.Playing)
            {
                interaction.reply({ embeds: [errorEmbed("There is no song playing")] });
                return;
            }
    
            const loopQueue = interaction.options.getString('type');
    
            let textToDisplay = 'Loop mode set to: ';
            if(loopQueue == 'loop queue')
            {
                setGlobalVariable(interaction.guild.id, 'loop', LoopType.LOOP_QUEUE);
                textToDisplay += "queue"
            }
            else if(loopQueue == 'loop song')
            {
                setGlobalVariable(interaction.guild.id, 'loop', LoopType.LOOP_SONG);
                textToDisplay += "song"
            }
            else if(loopQueue == 'no loop')
            {
                setGlobalVariable(interaction.guild.id, 'loop', LoopType.NO_LOOP);
                textToDisplay = "Loop mode disabled"
            }
            else
            {
                interaction.reply({ embeds: [errorEmbed("Invalid loop type")] });
                return;
            }

            Log.info(textToDisplay, null, interaction.guild.id, interaction.guild.name);
    
            interaction.reply({ embeds: [successEmbed(textToDisplay)] });
        }
        catch(error)
        {
            Log.error("Loop command failed", error, interaction.guild.id, interaction.guild.name);
        }
        const guild = interaction.guild;
        if (!guild) 
        {
            Log.error('Guild is undefined', null, interaction.guild.id, interaction.guild.name);
            return;
        }
    }
}