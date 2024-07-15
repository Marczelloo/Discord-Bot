const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytdl = require("@distube/ytdl-core");
const ytsr = require('ytsr');

const globals = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggles autoplay for the current queue'),

        async execute(interaction)
        {
            const memberVoiceChannel = interaction.member.voice.channel;
            if(!memberVoiceChannel)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You need to be in a voice channel to toggle autoplay")
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
                .setTitle("You must be in the same voice channel as bot to toggle autoplay!")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;           
            }

            const queue = globals.queue;
            if(queue == null || queue.length === 0)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("There is no song in queue to toggle autoplay")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            if(globals.loop !== globals.LoopType.NO_LOOP)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You can't toggle autoplay while loop is active")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }
            
            const autoplay = !globals.autoplay;
            globals.autoplay = autoplay;

            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Autoplay is now ${autoplay ? 'enabled' : 'disabled'}`)
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
        }
    }