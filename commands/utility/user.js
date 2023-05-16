const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides infromation about the user')
    .addUserOption(option => option
        .setName('user')
        .setDescription('user about which you want to display info') 
        .setRequired(true)
    ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const nickname = await interaction.guild.members.fetch(user.id);
        
        const embed = new EmbedBuilder(interaction)
        .setColor(0xff0000)
        .setTitle('User: ' + user.tag)
        .setThumbnail(user.avatarURL())
        .addFields(
            { name: "Username", value: user.username, inline: true},
            { name: "Nickname", value: nickname, inline: true},
        )
        .addImage()
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    } 
}