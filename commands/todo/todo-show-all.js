const { SlashCommandBuilder, ButtonStyle, MessageButton, EmbedBuilder, Message, ButtonInteraction } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const con = require('../../db');

const tasksPerPage = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo-show-all')
        .setDescription('Shows your all task')
    ,

    
    async execute(interaction) {
        const user = interaction.user.id;

        let errors = [];

        const query = `select title, description, deadline from todo where user_id = ${user}`;
        con.query(query, function (err, results){
            if(err){
                console.error(err);
                errors.push(err);
            }

            const tasks = results;

            const pages = splitIntoPages(tasks, tasksPerPage);

          
            const currentTasks = pages[currentPage - 1] || [];
            
            const taskDescription = currentTasks.map(taks => ` - ${task.title}`);

        });

        const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`To-Do List (Page ${currentPage})`)
        .setDescription(taskDescription.length > 0 ? taskDescription.join('\n') : "No tasks found.");


        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('prev_page')
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 1)
        )
            new ButtonBuilder()
            .setCustomId('next_page')
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === pages.length)
        
        interaction.reply({ embeds: [embed], components: [row]})
            .then(reply =>{
                const collector = reply.createMessageComponentCollector({ componentType: 'BUTTON' });

                collector.on('collect', buttonInteraction => {
                    if(buttonInteraction.customId === 'prev_page'){
                        const previousPage = currentPage - 1;
                        updatePage(buttonInteraction, previousPage);
                    }
                    else if(buttonInteraction.customId === 'next_page')
                    {
                        const nextPage = currentPage + 1;
                        updatePage(buttonInteraction, nextPage);
                    }
                });

                collector.on('end', () => {
                    row.components.forEach(component => {
                        component.setDisabled(true);
                    });
                    reply.edit({ component: [row]});
                });
            });
    }
};

function splitIntoPages(tasks, pageSize){
    const pages = [];
    for(let i = 0; i < tasks.length; i += pageSize){
        const page = tasks.slice(i , i + pageSize);
        pages.push(page);
    }

    return pages;
}

function updatePage(buttonInteraction, page){
    const { message } = buttonInteraction;

    const query = `select title, description, deadline from todo where user_id = ${user}`;
    con.query(query, function(err, results) {
        if(err) {
            console.error(err);
            return;
        }

        const tasks = results;

        const pages = splitIntoPages(tasks, tasksPerPage);

        const currentTasks = pages[page - 1] || [];

        const taskDescription = currentTasks.map(task => ` - ${task.title}`);

        const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`To-Do List (Page ${page})`)
        .setDescription(taskDescription.lenght > 0 ? taskDescription.join('\n') : 'No tasks found.');

        message.edit({ embeds: [embed]});
    })
}