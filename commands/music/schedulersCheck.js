const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('schedulers-check')
    .setDescription('Checks if the schedulers are enabled or disabled'),

    async execute(interaction)
    {
        const schedulers = require('./schedulers.json');
        const guildId = interaction.guildId;
        const guildSchedulers = schedulers.filter(data => data.guildId === guildId);

        if(guildSchedulers[0].schedulers === true)
        {
            const embed = new EmbedBuilder()
            .setTitle('Schedulers')
            .setDescription('Schedulers are enabled');

            interaction.reply({ embeds: [embed] });
        }
        else
        {
            const embed = new EmbedBuilder()
            .setTitle('Schedulers')
            .setDescription('Schedulers are disabled');

            interaction.reply({ embeds: [embed] });
        }
    }
}