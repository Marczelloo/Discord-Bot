const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const globals = require('../../global.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue')
    .addIntegerOption(option => option
        .setName('page')
        .setDescription('Page number')
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

        const buttonRow = new ActionRowBuilder()

        const nextPageButton = new ButtonBuilder()
        .setCustomId('next-button')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1198248590087307385');

        const previousPageButton = new ButtonBuilder()
        .setCustomId('previous-button')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1198248587369386134')

        buttonRow.addComponents(previousPageButton, nextPageButton);
        
        const botMember = await guild.members.fetch(globals.client.user.id);
        const botVoiceChannel = botMember.voice.channel;

        const memberVoiceChannel = interaction.member.voice.channel;
    
        if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("You must be in the same voice channel as bot to see queue!")
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

        const queue = globals.queue;
        let page = interaction.options.getInteger('page') || 1;
        const itemsPerPage = 20;
        const pages = Math.ceil(queue.length / itemsPerPage);

        if(queue.length == 0)
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Queue is empty")
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            return;
        }
        
        if(page > pages || page < 1)
        {
            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Invalid page number")
            .setTimestamp()

            interaction.reply({ embeds: [embed] });
            return;
        }

        const updateFileds = () => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            let fields = [];

            for(let i = start; i < end; i++) 
            {
                const song = queue[i];
                if(song) 
                {
                    fields.push({ name: `${i + 1}. ${song.title}`, value: song.url });
                }
            }

            return fields;
        }

        const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`Queue (Page ${page}/${pages})`)
        .addFields(updateFileds())
        .setTimestamp();

        if(pages === 1)
        {
            await interaction.reply({ embeds: [embed]});
            return;
        }

        if(page == 1)
        {
            previousPageButton.setDisabled(true);
        }

        if(page == pages)
        {
            nextPageButton.setDisabled(true);
        }
        
        await interaction.reply({ embeds: [embed], components: [buttonRow] });
        
        const filter = i => i.user.id === interaction.user.id;
        try
        {
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
            collector.on('collect', async(confirmation) => {
                if(confirmation.customId === 'next-button')
                {
                    if(page + 1 <= pages)
                    {
                        page++;
                        embed.setTitle(`Queue (Page ${page}/${pages})`)
                        embed.setFields(updateFileds());

                        if(page != 1)
                        {
                            previousPageButton.setDisabled(false);
                        }
                        else
                        {
                            previousPageButton.setDisabled(true);
                        }

                        await confirmation.update({ embeds: [embed], components: [buttonRow] });
                    }
                }
                else if(confirmation.customId === 'previous-button')
                {
                    if(page - 1 >= 1)
                    {
                        page--;
                        embed.setTitle(`Queue (Page ${page}/${pages})`)
                        embed.setFields(updateFileds());

                        if(page != pages)
                        {
                            nextPageButton.setDisabled(false);
                        }
                        else
                        {
                            nextPageButton.setDisabled(true);
                        }

                        await confirmation.update({ embeds: [embed], components: [buttonRow] });
                    }
                }
            });
        }
        catch(e)
        {
            console.error(e);
        }
    }
}
