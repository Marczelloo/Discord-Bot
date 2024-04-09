const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const con = require('../../db.js');
const { connect, disconnect } = require('../../db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo-add')
        .setDescription('Adds things to the to-do list')
        .addStringOption(option => option
            .setName('title')
            .setDescription('Title of your task')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('description')
            .setDescription('Description of your task')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('date')
            .setDescription('Deadline of your task in (Y-m-d) format')
            .setRequired(false)
        ),

    async execute(interaction) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        const user = interaction.user.id;
        const title = interaction.options.getString('title');
        const desc = interaction.options.getString('description');
        const deadline_text = interaction.options.getString('date');
        const deadline = dateRegex.test(interaction.options.getString('date')) ? interaction.options.getString('date') : false;
        
        let result;
        let error = [];

        if(!title) error.push("Title is required");

        if(!desc) error.push("Description is required");

        if(!deadline) error.push("Deadline is required");

        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Task adding failed!")
        .setDescription("Err: " + error.join(' | '))
        .setTimestamp();

        if(error.length > 0) return interaction.reply({ embeds: [embed] });


        if (deadline === false) 
        {
            error.push('Date is not in the proper format');
        } 
        else 
        {
            connect();
            const query = `INSERT INTO todo (user_id, title, description, deadline) VALUES('${user}', '${title}', '${desc}', '${deadline}');`;
            con.query(query, function (err, result) {
                if (err) 
                {
                    console.error(err);
                    error.push(err);

                    const failed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("Task adding failed!")
                    .setDescription("Err: " + error.join(' | '))
                    .setTimestamp();

                    interaction.reply({ embeds: [failed] });
                } 
                else 
                {
                    result = "Task " + title + " added successfully";

                    const success = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("Task added successfully!")
                    .setDescription(result.toString())
                    .setTimestamp();

                    interaction.reply({ embeds: [success] });
                }
            });
            disconnect();
        }
    }
};