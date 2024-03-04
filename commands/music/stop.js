const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const globals = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the player and clears the queue'),

    async execute(interaction)
    {
        const memberVoiceChannel = interaction.member.voice.channel;
        if(!memberVoiceChannel)
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("You need to be in a voice channel to stop the player")
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
            .setTitle("You must be in the same voice channel as bot to stop the player!")
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            return;           
        }

        if(globals.player == null)
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Player is not active!")
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            return;
        }

        globals.player.stop();
        globals.player = null;
        globals.resource = null;
        globals.queue = [];
        globals.playedSongs = [];
        globals.firstCommandTimestamp = null;
        globals.nowPlayingMessage = null;
        globals.eqEffect = null;
        globals.loop = globals.LoopType.NO_LOOP;
        globals.shuffle = false;
        globals.isSkipped = false;
        globals.schedulerPlaying = false;
        globals.timeout = null;
        globals.autoplay = false;

        const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Player stopped and queue cleared!")
        .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}
