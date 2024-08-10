const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, setGlobalVariable, shiftQueue, getClient, QueueType } = require('../../global.js');
const { errorEmbed } = require('../../helpers/embeds.js');
const Log = require('../../helpers/fancyLogs/log.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Amount of songs to skip')
            .setRequired(false)
        )
        .addIntegerOption(option => option
            .setName('id')
            .setDescription('ID of the song to skip')
            .setRequired(false)
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
                    interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to skip song!")] });
                    return;           
                }
    
                if(getServerData(interaction.guild.id).player == null || getServerData(interaction.guild.id).player.state.status !== AudioPlayerStatus.Playing)
                {
                    interaction.reply({ embeds: [errorEmbed("There is no song playing")] });
                    return;
                }
    
                
                const amount = interaction.options.getInteger('amount');
                
                if(!amount)
                {
                    const skipedTitle = getServerData(interaction.guild.id).queue[0].title;
                    const skipedUrl = getServerData(interaction.guild.id).queue[0].url;
                 
                    Log.info("Skipping song", null, interaction.guild.id, interaction.guild.name);
                    getServerData(interaction.guild.id).player.stop();
    
                    const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setAuthor({ name: "Skipped the current song" })
                    .setTitle(skipedTitle)
                    .setURL(skipedUrl)
                    .setTimestamp()
    
                    interaction.reply({ embeds: [embed] });
                    return
                }
    
                if(amount > getServerData(interaction.guild.id).queue.length)
                {
                    interaction.reply({ embeds: [errorEmbed("You can't skip more song than there are in the queue")] });
                    return;
                }
    
                let skippedSongs = [];
                for(let i = 0; i < amount; i++)
                {
                    const skipedSong = { 
                        title: getServerData(interaction.guild.id).queue[0].title, 
                        url: getServerData(interaction.guild.id).queue[0].url
                    }
                    skippedSongs.push(skipedSong);
                    shiftQueue(interaction.guild.id, QueueType.QUEUE);
                }
                getServerData(interaction.guild.id).player.stop();
    
                const embed = new EmbedBuilder()
                .setAuthor({ name: "Skipped multiple songs" })
                .setColor(0x00ff00)
                .setTitle("Skipped songs:")
                .addFields(
                    skippedSongs.forEach(element => {
                      return { name: element.title, value: element.url }  
                    })
                )
                .setTimestamp()

                Log.info("Skipped multiple songs", null, interaction.guild.id, interaction.guild.name);
    
                interaction.reply({ embeds: [embed] });
            }
            catch(error)
            {
                Log.error("Skip command failed", error, interaction.guild.id, interaction.guild.name);
            }  
        }
}