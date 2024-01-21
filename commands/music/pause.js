const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),

        async execute(interaction)
        {
            const memberVoiceChannel = interaction.member.voice.channel;
            if(!memberVoiceChannel)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You need to be in a voice channel to pause music")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            const guild = interaction.guild;
            if(!guild)
            {
                console.error('Guild is undefined');
                return;
            }

            const botMember = await guild.members.fetch(globals.client.user.id);
            const botVoiceChannel = botMember.voice.channel;


            if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You must be in the same voice channel as bot to pause song!")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;           
            }

            if(globals.player == null || globals.player.state.status !== AudioPlayerStatus.Playing)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("There is no song playing")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            globals.player.pause();

            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({ name: "Song paused: "})
            .setTitle(globals.queue[0].title)
            .setURL(globals.queue[0].url)
            .setImage(globals.queue[0].image)
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
        }

}