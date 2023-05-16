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
        const bots = interaction.guild.members.cache.filter(member => member.user.bot).size;
        const online =  interaction.guild.members.cache
        .filter(member => !member.user.bot && member.presence?.status === 'online' 
        || member.presence?.status === 'idle' || member.presence?.status === 'dnd').size;
        const ownerTag = owner.user.tag;       
        const creationDate = interaction.guild.createdAt.toDateString();
        const textChannels =  interaction.guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels =  interaction.guild.channels.cache.filter(channel => channel.type === 2).size;
        const boost =  interaction.guild.premiumTier;
        const nsfwLevel =  interaction.guild.nsfwLevel;
        const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Server name: '+ name)
        .setDescription(desc)
        .setThumbnail(icon)
        .addFields(
            { name: "Owner 👑", value: ownerTag, inline: true},
            { name: "Boost Lvl 🚀", value: boost.toString(), inline: true},
            { name: "NSFW Lvl 🔞", value: nsfwLevel.toString(), inline: true},
        )
        .addFields(
            { name: "Members 👤", value: memberCount.toString() , inline: true },
            { name: "Bots 🤖", value: bots.toString(), inline: true},
            { name: "Online 🟢", value: online.toString() , inline: true},
        )
        .addFields(
            { name: "Channels 🔤", value: textChannels.toString(), inline: true},
            { name: "Voice Channles 🔈", value: voiceChannels.toString(), inline: true},
            { name: "Creation Date 📆", value: creationDate, inline: true}   
        )
        .setTimestamp();

        await interaction.reply({ embeds: [embed]});
    }
}