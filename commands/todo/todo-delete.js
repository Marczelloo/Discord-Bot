const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const con = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo-delete')
        .setDescription("Delete's selected task")
        .addStringOption(option => option
            .setName('title')
            .setDescription('Title of task to delete')
            .setRequired(true))
    ,

    async execute(interaction) {
        const title = interaction.options.getString('title');

        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Task deletion failed')
        .setDescription('Error: Title is required')
        .setTimestamp();
        
        if(!title) return interaction.reply({ embeds: [embed] }); 
    
        let errors = [];
        try {
            const query = `SELECT * from todo WHERE title = '${title}'`;

            con.query(query, function(err, result) {
                if (err) {
                    console.log(err);
                    errors.push(err);

                    const fail = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('Failed to find task')
                        .setDescription('Error: ' + errors.join(' | '))
                        .setTimestamp();

                    interaction.reply({ embeds: [fail] });
                } else {
                    if (result === 0) {
                        const notFound = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle('Task not found or does not exist')
                            .setTimestamp();

                        interaction.reply({ embeds: [notFound] });
                    } else {
                        const del = `DELETE from todo WHERE title = '${title}'`;
                        con.query(del, (err, result) => {
                            if (err) {
                                console.log(err);

                                const fail = new EmbedBuilder()
                                    .setColor(0xff0000)
                                    .setTitle('Failed to delete task')
                                    .setDescription('Error: ' + errors.join(' | '))
                                    .setTimestamp();

                                interaction.reply({ embeds: [fail] });
                            } else {
                                const success = new EmbedBuilder()
                                    .setColor(0x00ff00)
                                    .setTitle(`Task deleted successfully`)
                                    .setTimestamp();

                                interaction.reply({ embeds: [success] });
                            }
                        });
                    }
                }
            });
        } catch (err) {
            console.log(err);

            const error = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(`Failed to delete task`)
                .setDescription('Error: ' + err)
                .setTimestamp();

            await interaction.reply({ embeds: [error] });
        }
    }
};
