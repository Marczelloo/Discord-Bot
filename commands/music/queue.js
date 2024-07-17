const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { ButtonStyle, ActionRowBuilder } = require('discord.js');

const { getServerData, getClient } = require('../../global.js');
const { createButton } = require('../../helpers/createButton.js');
const { errorEmbed } = require('../../helpers/embeds.js');

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

        const nextPageButton = createButton('next-button', ButtonStyle.Secondary, '1198248590087307385');
        const previousPageButton = createButton('previous-button', ButtonStyle.Secondary, '1198248587369386134');

        buttonRow.addComponents(previousPageButton, nextPageButton);
        
        const botMember = await guild.members.fetch(getClient().user.id);
        const botVoiceChannel = botMember.voice.channel;

        const memberVoiceChannel = interaction.member.voice.channel;
    
        if(botVoiceChannel && memberVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
        {
            interaction.reply({ embeds: [errorEmbed("You must be in the same voice channel as bot to see queue!")] });
            return;           
        }

        if(getServerData(interaction.guild.id).player == null || getServerData(interaction.guild.id).player.state.status !== AudioPlayerStatus.Playing)
        {
            interaction.reply({ embeds: [errorEmbed("There is no song playing")] });
            return;
        }

        const queue = getServerData(interaction.guild.id).queue;
        let page = interaction.options.getInteger('page') || 1;
        const itemsPerPage = 20;
        const pages = Math.ceil(queue.length / itemsPerPage);

        if(queue.length == 0)
        {
            interaction.reply({ embeds: [errorEmbed("Queue is empty")] });
            return;
        }
        
        if(page > pages || page < 1)
        {
            interaction.reply({ embeds: [errorEmbed("Invalid page number")] });
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
