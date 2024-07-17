const { SlashCommandBuilder } = require('@discordjs/builders');

const { getServerData, setGlobalVariable, getClient } = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearqueue')
        .setDescription('Clears the queue'),

    async execute(interaction)
    {
        const guild = interaction.guild;
        if(!guild)
        {
            console.error('Guild is undefined');
            return;
        }
        
        const botMember = await guild.members.fetch(getClient().user.id);
        const botVoiceChannel = botMember.voice.channel;
        
        const memberVoiceChannel = interaction.member.voice.channel;
        
        if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
        {
            interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to use this command!")] });
            return;           
        }

        if(getServerData(interaction.guild.id).player == null)
        {
            interaction.reply({ embeds: [errorEmbed("There is no song playing")] });
            return;
        }

        setGlobalVariable(interaction.guild.id, 'queue', []);
        setGlobalVariable(interaction.guild.id, 'originalQueue', []);
        setGlobalVariable(interaction.guild.id, 'playedSongs', []);
        setGlobalVariable(interaction.guild.id, 'isSkipped', true);
        setGlobalVariable(interaction.guild.id, 'loop', 'NO_LOOP');
        setGlobalVariable(interaction.guild.id, 'shuffle', false);
        setGlobalVariable(interaction.guild.id, 'nowPlayingMessage', null);

        interaction.reply({ embeds: [successEmbed("Queue cleared!")] });
    }
}