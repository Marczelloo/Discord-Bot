const { SlashCommandBuilder,  italic, EmbedBuilder } = require('discord.js');
const con = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo-show-all')
        .setDescription('Shows your all task')
    ,

    
    async execute(interaction) {
        const user = interaction.user.id;

        let errors = [];
        let tasks;

        try {
          const query = `SELECT title, description, deadline FROM todo WHERE user_id = ${user}`;
           
          con.query(query, function(err, result){
            if(err){
                console.log(err);
                errors.push(err);

                const fail = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Failed to show tasks')
                .setDescription('Error: ' + errors.join(' | '))
                .setTimestamp();

                interaction.reply({ embeds: [fail] });

            } 
            else 
            {
                const success = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle(`To-Do List - ${interaction.user.tag}`)
                .setTimestamp();

                if(result.length <= 0 ){
                    success.setDescription('No tasks found.');
                } else {
                    const fields = [];
                    result.forEach((task, id) =>{
                        fields.push({name: '#' + (id + 1) + " | " + task.title, value: task.description + '\n' + italic('Deadline: ' + task.deadline.toDateString())});
                    })
                    const success = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle(`To-Do List - ${interaction.user.tag}`)
                    .addFields(fields)
                    .setTimestamp();
        
                    interaction.reply({ embeds: [success] });
                }
            } 
          });
        } catch(err){
            console.log(err);

            const error = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(`Failed to show tasks`)
                .setDescription('Err: ' + err)
                .setTimestamp();

                await interaction.reply({ embeds: [error] });
        }
    }
    };