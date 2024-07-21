const { SlashCommandBuilder } = require('discord.js');

const { getServerData, setGlobalVariable, getClient, LoopType } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');
const Log = require('../../helpers/fancyLogs/log.js');
const vcLeaveReset = require('../../helpers/vcLeaveReset.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the player and clears the queue'),

    async execute(interaction)
    {
        try
        {
            const memberVoiceChannel = interaction.member.voice.channel;
            if(!memberVoiceChannel)
            {
                interaction.reply({ embeds: [errorEmbed("You need to be in a voice channel to stop the player")] });
                return;
            }
    
            const guild = interaction.guild;
            if(!guild)
            {
                Log.error('Guild is undefined', null, interaction.guild.id, interaction.guild.name);
                return;
            }
    
            const botMember = await guild.members.fetch(getClient().user.id);
            const botVoiceChannel = botMember.voice.channel;
            
            if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
            {
                interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to stop the player!")] });
                return;           
            }
    
            if(getServerData(interaction.guild.id).player == null)
            {
                interaction.reply({ embeds: [errorEmbed("Player is not active!")] });
                return;
            }

            vcLeaveReset(interaction.guild.id);

            Log.info('Player stopped and queue cleared', null, interaction.guild.id, interaction.guild.name);
    
            interaction.reply({ embeds: [successEmbed("Player stopped and queue cleared!")] });
        }
        catch(error)
        {
            Log.error("Stop command failed", error, interaction.guild.id, interaction.guild.name);
        }
    }
}
