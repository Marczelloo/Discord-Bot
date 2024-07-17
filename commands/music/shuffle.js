const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, setGlobalVariable, getClient} = require('../../global.js');
const { errorEmbed, successEmbed } = require('../../helpers/embeds.js');

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
            
            const botMember = await guild.members.fetch(getClient().user.id);
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

            if(getServerData(interaction.guild.id).player == null || getServerData(interaction.guild.id).player.state.status !== AudioPlayerStatus.Playing)
            {
                interaction.reply({ embeds: [errorEmbed("There is no song playing")] });
                return;
            }

            if(getServerData(interaction.guild.id).queue.length < 2)
            {
                interaction.reply({ embeds: [errorEmbed("There is no songs to shuffle. Minimal amount songs in queue to shuffle: 3")] });
                return;
            }

            console.log(getServerData(interaction.guild.id).shuffle);
            const shuffle = !getServerData(interaction.guild.id).shuffle;
            console.log(shuffle);
            setGlobalVariable(interaction.guild.id, 'shuffle', shuffle);

            if(getServerData(interaction.guild.id).shuffle)
            {
                setGlobalVariable(interaction.guild.id, 'originalQueue', getServerData(interaction.guild.id).queue);
                setGlobalVariable(interaction.guild.id, 'queue', getServerData(interaction.guild.id).queue.sort(() => Math.random() - 0.5));
            }
            else
            {
                setGlobalVariable(interaction.guild.id, 'queue', getServerData(interaction.guild.id).originalQueue);
            }
            
            await interaction.reply({ embeds: [successEmbed(`Shuffle ${getServerData(interaction.guild.id).shuffle ? 'enabled' : 'disabled'}`)] });
        }
}