const { SlashCommandBuilder } = require('discord.js');

const { getServerData, setGlobalVariable, LoopType, getClient } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggles autoplay for the current queue'),

        async execute(interaction)
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
                console.error('Guild is undefined');
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

            interaction.reply({ embeds: [successEmbed(`Autoplay is now ${autoplay ? 'enabled' : 'disabled'}`)] });
        }
    }