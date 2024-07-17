const { SlashCommandBuilder } = require('discord.js');

const { getServerData, setGlobalVariable, getClient } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the player and clears the queue'),

    async execute(interaction)
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
            console.error('Guild is undefined');
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

        setGlobalVariable('player', null);
        setGlobalVariable('resource', null);
        setGlobalVariable('queue', []);
        setGlobalVariable('playedSongs', []);
        setGlobalVariable('firstCommandTimestamp', null);
        setGlobalVariable('nowPlayingMessage', null);
        setGlobalVariable('eqEffect', null);
        setGlobalVariable('loop', globals.LoopType.NO_LOOP);
        setGlobalVariable('shuffle', false);
        setGlobalVariable('isSkipped', false);
        setGlobalVariable('schedulerPlaying', false);
        setGlobalVariable('timeout', null);
        setGlobalVariable('autoplay', false);

        interaction.reply({ embeds: [successEmbed("Player stopped and queue cleared!")] });
    }
}
