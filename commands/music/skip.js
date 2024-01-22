const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Amount of songs to skip')
            .setRequired(false)
        )
        .addIntegerOption(option => option
            .setName('id')
            .setDescription('ID of the song to skip')
            .setRequired(false)
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
                .setTitle("You must be in the same voice channel as bot to skip song!")
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

            
            const amount = interaction.options.getInteger('amount');
            
            if(!amount)
            {
                const skipedTitle = globals.queue[0].title;
                const skipedUrl = globals.queue[0].url;
             
                console.log("Skipping song");
                globals.player.stop();

                const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setAuthor({ name: "Skipped the current song" })
                .setTitle(skipedTitle)
                .setURL(skipedUrl)
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return
            }

            if(amount > globals.queue.length)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You can't skip more songs than there are in the queue")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            let skippedSongs = [];
            for(let i = 0; i < amount; i++)
            {
                const skipedSong = { 
                    title: globals.queue[0].title, 
                    url: globals.queue[0].url
                }
                skippedSongs.push(skipedSong);
                globals.queue.shift();
            }
            globals.player.stop();

            const embed = new EmbedBuilder()
            .setAuthor({ name: "Skipped multiple songs" })
            .setColor(0x00ff00)
            .setTitle("Skipped songs:")
            .addFields(
                skippedSongs.forEach(element => {
                  return { name: element.title, value: element.url }  
                })
            )
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            
        }
}