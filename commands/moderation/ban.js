const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban users!'),

    async execute(interacion) {
        await interacion.reply('Ban!');
    }
}