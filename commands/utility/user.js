const { SlashCommandBuilder } = require('discord.js');

modulde.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides infromation about the user'),

    async execute(interaction) {
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joindedAt}`);
    } 
}