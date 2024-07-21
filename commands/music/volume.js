const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, setGlobalVariable, getClient } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');
const Log = require('../../helpers/fancyLogs/log.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Changes the volume of the player (0-100)')
        .addNumberOption(option => option 
            .setName('volume')
            .setDescription('New volume')
            .setRequired(true)
        ),
        
        async execute(interaction)
        {
            try
            {
                const guild = interaction.guild;
                if (!guild) 
                {
                    Log.error('Guild is undefined', null, interaction.guild.id, interaction.guild.name);
                    return;
                }
                
                const botMember = await guild.members.fetch(getClient().user.id);
                const botVoiceChannel = botMember.voice.channel;
    
                const memberVoiceChannel = interaction.member.voice.channel;
            
                if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
                {
                    interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as a bot to skip song!")] });
                    return;           
                }
    
                if(getServerData(interaction.guild.id).player == null || getServerData(interaction.guild.id).player.state.status !== AudioPlayerStatus.Playing)
                {
                    interaction.reply({ embeds: [errorEmbed("Player is not active! Play song before changing volume!")] });
                    return;
                }
    
                const volume = interaction.options.getNumber('volume');
    
                const changeVolume = async (volume, voiceCom) => {
                    if(volume < 0 || volume > 500)
                    {
                        interaction.reply({ embeds: [errorEmbed("Volume must be between 0 and 100!")] });
                        return;
                    }
        
                    getServerData(interaction.guild.id).resource.volume.setVolume(volume / 100);
        
                    if(voiceCom)
                    {
                        globals.commandChannel.send({ embeds: [successEmbed(`Volume set to ${volume}`)] });
                    }
                    else
                    {
                        await interaction.reply({ embeds: [successEmbed(`Volume set to ${volume}`)] });
                    }
    
                }
                module.exports = changeVolume;
    
                Log.info("Changing volume", null, interaction.guild.id, interaction.guild.name);

                changeVolume(volume, false)    
            }
            catch(error)
            {
                Log.error("Volume command failed", error, interaction.guild.id, interaction.guild.name);
            }  
        }
}