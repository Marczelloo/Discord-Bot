const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');
const { text } = require('stream/consumers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Type of loop')
            .setRequired(true)
            .addChoices(
                { name: 'Loop song', value: 'loop song'},
                { name: 'Loop queue', value: 'loop queue' },
                { name: 'Disable loop', value: 'no loop' }
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
            .setTitle("You must be in the same voice channel as bot to loop song!")
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

        const loopQueue = interaction.options.getString('type');

        let textToDisplay = 'Loop mode set to: ';
        if(loopQueue == 'loop queue')
        {
            globals.loop = globals.LoopType.LOOP_QUEUE;
            textToDisplay += "queue"
        }
        else if(loopQueue == 'loop song')
        {
            globals.loop = globals.LoopType.LOOP_SONG;
            textToDisplay += "song"
        }
        else if(loopQueue == 'no loop')
        {
            globals.loop = globals.LoopType.NO_LOOP;
            textToDisplay = "Loop mode disabled"
        }
        else
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Invalid loop type")
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            return;
        }

        const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(textToDisplay)
        .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}