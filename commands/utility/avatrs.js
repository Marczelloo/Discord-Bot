const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays avatar of the user')
    .addUserOption(option => option
        .setName('user')
        .setDescription('user from which you want to steal avatar')
        .setRequired(true)
    ),
    

    async execute(interaction){
        const user = interaction.options.getUser('user');
        const userAvatar = user.avatarURL();

        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Avatar of user: " + user.tag)
        .setURL(userAvatar)
        .setImage(userAvatar)
        .setTimestamp()

        await interaction.reply({ embeds: [embed]});    
    }
}