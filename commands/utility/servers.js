const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),

    async execute(interaction){
        const name = interaction.guild.name;
        const desc = interaction.guild.description;
        const icon = interaction.guild.iconURL();
        const memberCount = (interaction.guild.memberCount);
        const owner = await interaction.guild.members.fetch(interaction.guild.ownerId);
        const ownerTag = owner.user.tag;       
        const creationDate = interaction.guild.createdAt.toDateString();
        const textChannels = await interaction.guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = await interaction.guild.channels.cache.filter(channel => channel.type === 2).size;
        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Server name: '+ name)
        .setDescription(desc)
        .setThumbnail(icon)
        .addFields(
            { name: "Owner ", value: ownerTag, inline: true},
            { name: "Members", value: memberCount.toString(), inline: true },
            { name: "Online", value: 'Nie ma nie umiem :(', inline: true},
        )
        .addFields(
            { name: "Creation Date", value: creationDate, inline: true},
            { name: "Channels", value: textChannels.toString(), inline: true},
            { name: "VoiceChannles", value: voiceChannels.toString(), inline: true}   
        )
        .setTimestamp();

        await interaction.reply({ embeds: [embed]});
    }
}