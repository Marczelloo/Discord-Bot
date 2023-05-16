const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gaymeter')
    .setDescription('read your gay level'),

    async execute(interaction){
        const random = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        const text = "🏳️‍⚧️ You are gay in " + random + " % 🏳️‍⚧️";

        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Gaymeter: "  + text)
        .setTimestamp()

        await interaction.reply({ embeds: [embed]});    
    }
}