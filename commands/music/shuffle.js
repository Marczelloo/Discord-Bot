const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue (on/off)'),

        async execute(interaction)
        {
            
            const guild = interaction.guild;
            if(!guild)
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
                .setTitle("You must be in the same voice channel as bot to use this command!")
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

            if(globals.queue.length < 2)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("There is no song to shuffle")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            globals.shuffle = !globals.shuffle;       

            if(globals.shuffle)
            {
                globals.originalQueue = globals.queue;
                globals.queue = globals.queue.sort(() => Math.random() - 0.5);
            }
            else
            {
                globals.queue = globals.originalQueue;
            }
            
            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Shuffle ${globals.shuffle ? 'enabled' : 'disabled'}`)
            .setTimestamp()

            await interaction.reply({ embeds: [embed] });
        }
}