const { SlashCommandBuilder } = require('discord.js');

const { getServerData, setGlobalVariable, LoopType, getClient } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');
const Log = require('../../helpers/fancyLogs/log.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggles autoplay for the current queue'),

        async execute(interaction)
        {
            try
            {
                const memberVoiceChannel = interaction.member.voice.channel;
                if(!memberVoiceChannel)
                {
                    interaction.reply({ embeds: [errorEmbed("You need to be in a voice channel to toggle autoplay")] });
                    return;
                }
    
                const guild = interaction.guild;
                if(!guild)
                {
                    Log.error("Guild is undefined", null, interaction.guild.id, interaction.guild.name);
                    return;
                }
    
                const botMember = await guild.members.fetch(getClient().user.id);
                const botVoiceChannel = botMember.voice.channel;
                
                if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
                {
                    interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to toggle autoplay!")] });
                    return;           
                }
    
                const queue = getServerData(interaction.guild.id).queue;
                if(queue == null || queue.length === 0)
                {
                    interaction.reply({ embeds: [errorEmbed("There is no song in queue to toggle autoplay")] });
                    return;
                }
    
                if(getServerData(interaction.guild.id).loop !== LoopType.NO_LOOP)
                {
                    interaction.reply({ embeds: [errorEmbed("You can't toggle autoplay while loop is active!")] });
                    return;
                }
                
                setGlobalVariable(interaction.guild.id, 'autoplay', !getServerData(interaction.guild.id).autoplay);
                
                Log.info(`Autoplay ${getServerData(interaction.guild.id).autoplay ? 'enabled' : 'disabled'}`, null, interaction.guild.id, interaction.guild.name);
    
                interaction.reply({ embeds: [successEmbed(`Autoplay ${getServerData(interaction.guild.id).autoplay ? 'enabled' : 'disabled'}`)] });
            }
            catch(error)
            {
                Log.error("Autoplay command failed", error, interaction.guild.id, interaction.guild.name);
            }
        }
    }