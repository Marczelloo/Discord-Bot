const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const Log = require('../../helpers/fancyLogs/log');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays avatar of the user')
    .addUserOption(option => option
        .setName('user')
        .setDescription('user from which you want to steal avatar')
        .setRequired(false)
    )
    .addBooleanOption(option => option
        .setName('dawid')
        .setDescription('Dawid is the best!')
        .setRequired(false)
    ),

    async execute(interaction){
        try
        {
            const dawid = interaction.options.getBoolean('dawid');
            Log.info("Avatar command", null, interaction.guild.id, interaction.guild.name);
            if(dawid)
            {
                const image = fs.readFileSync(__dirname + '/dawid.jpg');
    
                const embed = new EmbedBuilder()
                .setColor(0x0000ff)
                .setTitle("Dawid is the best!")
    
                await interaction.reply({ embeds: [embed], files: [image] });
            }
            else
            {
                const user = interaction.options.getUser('user');
                const userAvatar = user.avatarURL();
        
                const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Avatar of user: " + user.tag)
                .setURL(userAvatar)
                .setImage(userAvatar)
                .setTimestamp()
        
                await interaction.reply({ embeds: [embed]});    
            }
        }
        catch(error)
        {
            Log.error("Avatar command failed", error, interaction.guild.id, interaction.guild.name);
        }
        
    }
}