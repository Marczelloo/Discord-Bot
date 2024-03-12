const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all commands')
    .addStringOption(option => option
        .setName('category')
        .setDescription('category of commands you want to see')
        .addChoices(
            { name: 'utility', value: 'utility'},
            { name: 'fun', value: 'fun'},
            { name: 'moderation', value: 'moderation'},
            { name: 'music', value: 'music'},
            { name: 'todo', value: 'todo' },
            { name: 'all', value: 'all'}
        )
        .setRequired(false)
    ),

    async execute(interaction)
    {
        const category = interaction.options.getString('category');
        let index = 0;
        const maxIndex = 6;

        const utilityField = { name: 'Utility: ', 
            value: "• **Avatar** - displays avatar of selected user \n"
            + "• **Help** - displays all commands and their functionality \n"
            + "• **Server** - displays info about current server \n"
            + "• **User** - displays info about selected user \n" 
        }

        const todoField = { name: 'ToDo: ',
            value: "• **todo-add** - Adds task to your todo list \n"
            + "• **todo-show-all** - Shows all task in your todo list \n"
            + "• **todo-delete ** - Removes task from your todo list \n"
            + "• **todo-remind ** - Sets a reminder for a specific task \n" 
        }
        
        const funField = { name: 'Fun: ',
            value: "• **Conflip** - Flips the coin \n"
            + "• **Gaymeter** - Measures how much are you gay \n"
            + "• **Ping** - Responds with Pong \n" 
        }   

        const musicField = { name: 'Music: ',
            value: "• **Play** - Plays songs by its name or url \n"
            + "• **Queue** - Show songs in the queue \n"
            + "• **ClearQueue** - Clears the queue \n"
            + "• **Pause** - Pauses current song \n"
            + "• **Resume** - Resumes current song \n"
            + "• **Loop** - Loops current song or queue \n"
            + "• **Skip** - Skips current song, number of songs or specific song from queue \n"
            + "• **Volume** - Changes the volume of player (default - 5)\n"
            + "• **Equalizer** - Changes the equalizer settings to selected preset \n" 
            + "• **Autoplay** - Toggles autoplay for the current queue \n"
            + "• **Schedulers** - Playe scheduled songs on specific hours \n"
            + "• **Schedulers-Check** - Checks if schedulers are on/off \n"
            + "• **Stop** - Stops the player and clears the queue \n"
        }

        const moderationField = { name: 'Moderation: ',
            value: "• **ex.1 ** - ex.1 desc \n"
            + "• **ex.2 ** - ex.2 desc \n"
            + "• **ex.3 ** - ex.3 desc \n" 
        }
        
        const helpField = { name: 'Select type of commands you want to see: ',
            value: "• **Utility** - utility commands \n"
            + "• **Fun** - fun commands \n"
            + "• **Moderation** - moderation commands \n"
            + "• **Music** - music commands \n"
            + "• **ToDo** - todo commands \n"
            + "• **All** - all commands" 
        }

        const previousButton = new ButtonBuilder()
        .setCustomId('previous')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('1198248587369386134')


        const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('1198248590087307385');

        const firstPageButton = new ButtonBuilder()
        .setCustomId('firstPage')
        .setLabel('First page')
        .setStyle(ButtonStyle.Primary)

        
        
        const row = new ActionRowBuilder()
        .addComponents(previousButton, firstPageButton, nextButton);

        const helpEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help")
        .setFields(helpField)
        .setTimestamp()

        const utilityEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help - Utility commands")
        .setFields(utilityField)
        .setTimestamp()

        const funEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help - Fun commands")
        .addFields(funField)
        .setTimestamp()   

        const moderationEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help - Fun commands")
        .addFields(moderationField)
        .setTimestamp()

        const musicEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help - Fun commands")
        .addFields(musicField)
        .setTimestamp()

        const todoEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help - ToDo commands")
        .addFields(todoField)
        .setTimestamp()

        const fields = [utilityField, funField, moderationField, musicField, todoField];

        const allEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Help - All commands")
        .setTimestamp()
        .setDescription("**List of all commands: ** \n\n")
        .addFields(fields)

        switch(category)
        {
            case null:
                index = 0;
        
                row.components[0].setDisabled(true);
                await interaction.reply({ embeds: [helpEmbed], components: [row], ephemeral: true });
                break;
            case 'utility':
                index = 1;
                
                await interaction.reply({ embeds: [utilityEmbed], components: [row], ephemeral: true });
                break;
            case 'fun':
                index = 2;

                await interaction.reply({ embeds: [funEmbed], components: [row], ephemeral: true });
                break;
            case 'moderation':
                index = 3;
                
                await interaction.reply({ embeds: [moderationEmbed], components: [row], ephemeral: true });
                break;
            case 'music':
                index = 4;
                
                interaction.reply({ embeds: [musicEmbed], components: [row], ephemeral: true });
                break;
            case 'todo':
                index = 5;
                
                interaction.reply({ embeds: [todoEmbed], components: [row], ephemeral: true });
                break;
            case 'all':
                index = 6;
                
                row.components[2].setDisabled(true);

                interaction.reply({ embeds: [allEmbed], components: [row], ephemeral: true });
                break;
        }

        const filter = i => i.user.id === interaction.user.id;
        try
        {
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
            collector.on('collect', async(confirmation) => {
                if(confirmation.customId === 'next')
                {
                    index++;
                }
                else if(confirmation.customId === 'previous')
                {
                    index--;
                }
                else if(confirmation.customId === 'firstPage')
                {
                    index = 0;
                }

                switch(index)
                {
                    case 0:
                        row.components[0].setDisabled(true);
                        row.components[2].setDisabled(false);

                        try
                        {
                            await confirmation.update({ embeds: [helpEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                        break;
                    case 1:
                        row.components[0].setDisabled(false);
                        row.components[2].setDisabled(false);

                        try
                        {
                            await confirmation.update({ embeds: [utilityEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                        break;
                    case 2:
                        row.components[0].setDisabled(false);
                        row.components[2].setDisabled(false);

                        try
                        {
                            await confirmation.update({ embeds: [funEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                        break;
                    case 3:
                        row.components[0].setDisabled(false);
                        row.components[2].setDisabled(false);

                        try
                        {
                            await confirmation.update({ embeds: [moderationEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                        break;
                    case 4:
                        row.components[0].setDisabled(false);
                        row.components[2].setDisabled(false);

                        try
                        {
                            await confirmation.update({ embeds: [musicEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                        break;
                    case 5:
                        row.components[0].setDisabled(false);
                        row.components[2].setDisabled(false);

                        try
                        {
                            await confirmation.update({ embeds: [todoEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                        break;
                    case 6:
                        row.components[0].setDisabled(false);
                        row.components[2].setDisabled(true);

                        try
                        {
                            await confirmation.update({ embeds: [allEmbed], components: [row], ephemeral: true });
                        }
                        catch(e)
                        {
                            console.error(e);
                        }

                        break;
                }
            });
        }
        catch(e)
        {
            console.error(e);

        }
        
    }
}
