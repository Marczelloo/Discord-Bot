const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

const globals = require('../../global.js');

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

        if(globals.player == null)
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("There is no song playing")
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            return;
        }

        globals.queue = [];
        globals.originalQueue = [];
        globals.playedSongs = [];
        globals.isSkipped = true;
        globals.loop = globals.LoopType.NO_LOOP;
        globals.shuffle = false;
        globals.nowPlayingMessage = null;

        const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Queue cleared!")
        .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}