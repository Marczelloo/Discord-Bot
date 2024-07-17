const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { errorEmbed, songEmbed } = require('../../helpers/embeds.js');
const { getServerData, getClient } = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),

        async execute(interaction)
        {
            const memberVoiceChannel = interaction.member.voice.channel;
            if(!memberVoiceChannel)
            {
                interaction.reply({ embeds: [errorEmbed("You need to be in a voice channel to pause music")] });
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
                interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to pause song!")] });
                return;           
            }

            if(getServerData(interaction.guild.id).player == null || getServerData(interaction.guild.id).player.state.status !== AudioPlayerStatus.Playing)
            {
                interaction.reply({ embeds: [errorEmbed("There is no song playing")] });
                return;
            }

            getServerData(interaction.guild.id).player.pause();

            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({ name: "Song paused: "})
            .setTitle(globals.queue[0].title)
            .setURL(globals.queue[0].url)
            .setImage(globals.queue[0].image)
            .setTimestamp()

            interaction.reply({ embeds: [songEmbed] });
        }

}