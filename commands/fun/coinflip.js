const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin'),

    async execute(interaction){
        const random = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        const coin = random === 0 ?  "Tails" : random === 1 ? "Heads" : "The coint stood up and walked out";

        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("🪙   " + coin)
        .setTimestamp()

        await interaction.reply({ embeds: [embed]});    
    }
}