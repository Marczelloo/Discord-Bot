const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('schedulers')
    .setDescription('Turns on/off scheduled songs'),

        async execute(interaction) {
            const filePath = path.resolve(__dirname, "schedulers.json");

            try {
                const fileData = fs.readFileSync(filePath, 'utf8');
                let jsonData = JSON.parse(fileData);

                let guildData = jsonData.find(data => data.guildId === interaction.guild.id);

                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTimestamp();

                if (guildData) {
                    guildData.schedulers = !guildData.schedulers;
                    embed.setTitle(`Schedulers turned ${guildData.schedulers ? 'on' : 'off'}!`);
                } else {
                    const newGuildData = {
                        guildId: interaction.guild.id,
                        schedulers: true
                    };
                    embed.setTitle(`Schedulers turned on!`);
                    jsonData.push(newGuildData);
                }

                await interaction.reply({ embeds: [embed] });

                fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
                    if (err) console.error(err);
                });
            } catch (err) {
                console.error(err);
                fs.writeFileSync(filePath, '[]', 'utf8');
            }
        }
    }
