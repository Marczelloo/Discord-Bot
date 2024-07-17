const { SlashCommandBuilder } = require('discord.js');

const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');
const { getServersData, setGlobalVariable, getClient } = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equalizer')
        .setDescription('Changes the equalizer')
        .addStringOption(option => option
            .setName('preset')
            .setDescription('Preset to use')
            .setRequired(true)
            .addChoices(
                { name: 'default', value: 'none' },
                { name : 'BassBoost', value: 'bassboost' },
                { name: 'BassBostV2', value: 'bass-v2' },
                { name: 'EarRape', value: 'earrape' },
                { name: '8bit', value: 'eightBit'},
                { name: 'Nightcore', value: 'nightcore' },
                { name: 'SlowAndReverbed', value: 'slowReverb' },
                { name: 'DolbyRetardos', value: 'dolbyRetardos' },
                { name: 'Inverted', value: 'inverted'},
                { name: 'toiletAtClub', value: 'toiletAtClub' },
            )
        ),

        async execute(interaction)
        {
            const guild = interaction.guild;
            if (!guild) 
            {
                console.error('Guild is undefined');
                return;
            }
            
            const botMember = await guild.members.fetch(getClient().user.id);
            const botVoiceChannel = botMember.voice.channel;

            const memberVoiceChannel = interaction.member.voice.channel;
        
            if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
            {
                interaction.reply({ embeds: [errorEmbed("You must be in the same voice channle to set equalizer")] });
                return;           
            }

            const preset = interaction.options.getString('preset');
            if(!preset)
            {
                interaction.reply({ embeds: [errorEmbed("Preset is required!")] });
                return;
            }
            
            if(preset === 'none')
            {
                setGlobalVariable(interaction.guild.id, 'eqEffect', null);
                
                interaction.reply({ embeds: [successEmbed(`Equalizer set to ${preset}!`)] });
                return;
            }
            
            setGlobalVariable(interaction.guild.id, 'eqEffect', preset);

            interaction.reply({ embeds: [successEmbed(`Equalizer set to ${preset}! Equalizer effect will be applied to next song!`)] });
        }
}