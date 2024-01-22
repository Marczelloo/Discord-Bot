const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');

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
                { name: 'Inverted', value: 'inverted'}
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

            const preset = interaction.options.getString('preset');
            if(!preset)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Preset is required!")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }
            
            if(preset === 'none')
            {
                globals.eqEffect = null;
                const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle(`Equalizer set to ${preset}!`)
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }
            
            globals.eqEffect = preset;

            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Equalizer set to ${preset}! Equalizer effect will be applied to next song!`)
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
        }
}