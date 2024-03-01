const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');

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
            const guild = interaction.guild;
            if (!guild) 
            {
                console.error('Guild is undefined');
                return;
            }
            
            const botMember = await guild.members.fetch(globals.client.user.id);
            const botVoiceChannel = botMember.voice.channel;

            const memberVoiceChannel = interaction.member.voice.channel;
        
            if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You must be in the same voice channel as bot to skip song!")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;           
            }

            if(globals.player == null || globals.player.state.status !== AudioPlayerStatus.Playing)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Player is not active! Playe song before changing volume!")   
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            const volume = interaction.options.getNumber('volume');

            const changeVolume = async (volume, voiceCom) => {
                if(volume < 0 || volume > 500)
                {
                    const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("Volume must be between 0 and 100!")
                    .setTimestamp()
    
                    interaction.reply({ embeds: [embed] });
                    return;
                }
    
                globals.resource.volume.setVolume(volume / 100);
    
                const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle(`Volume set to ${volume}`)
                .setTimestamp()
    
                if(voiceCom)
                {
                    globals.commandChannel.send({ embeds: [embed] });
                }
                else
                {
                    await interaction.reply({ embeds: [embed] });
                }

            }
            module.exports = changeVolume;

            changeVolume(volume, false)        
        }
}