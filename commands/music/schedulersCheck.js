const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Log = require('../../helpers/fancyLogs/log');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('schedulers-check')
    .setDescription('Checks if the schedulers are enabled or disabled'),

    async execute(interaction)
    {
        try
        {
            const schedulers = require('./schedulers.json');
            const guildId = interaction.guildId;
            const guildSchedulers = schedulers.filter(data => data.guildId === guildId);
            
            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Schedulers turned ${guildSchedulers[0].schedulers ? 'on' : 'off'}!`)
            .setTimestamp();

            Log.info(`Schedulers turned ${guildSchedulers[0].schedulers ? 'on' : 'off'}`, null, interaction.guild.id, interaction.guild.name);

            await interaction.reply({ embeds: [embed] });
        }
        catch(error)
        {
            Log.error("Schedulers check command failed", error, interaction.guild.id, interaction.guild.name);
        }
    }
}