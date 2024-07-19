const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const Log = require('../../helpers/fancyLogs/log');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('schedulers')
    .setDescription('Turns on/off scheduled songs'),

        async execute(interaction) {
            const filePath = path.resolve(__dirname, "schedulers.json");

            try 
            {
                const fileData = fs.readFileSync(filePath, 'utf8');
                let jsonData = JSON.parse(fileData);

                let guildData = jsonData.find(data => data.guildId === interaction.guild.id);

                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTimestamp();

                if (guildData) 
                    {
                    guildData.schedulers = !guildData.schedulers;
                    embed.setTitle(`Schedulers turned ${guildData.schedulers ? 'on' : 'off'}!`);
                } 
                else 
                {
                    const newGuildData = {
                        guildId: interaction.guild.id,
                        schedulers: true
                    };
                    embed.setTitle(`Schedulers turned on!`);
                    jsonData.push(newGuildData);
                    Log.info(`Schedulers added and turned on`, null, interaction.guild.id, interaction.guild.name);
                }

                Log.info(`Schedulers turned ${guildData.schedulers ? 'on' : 'off'}`, null, interaction.guild.id, interaction.guild.name);

                await interaction.reply({ embeds: [embed] });

                fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
                    if (err) Log.error("Failed to write to schedulers.json file", err, interaction.guild.id, interaction.guild.name);
                });
            } 
            catch (error) 
            {
                Log.error('Failed to read schedulers.json file', error, interaction.guild.id, interaction.guild.name);
                Log.info('Creating a new schedulers.json file');
                fs.writeFileSync(filePath, '[]', 'utf8');
            }
        }
    }
