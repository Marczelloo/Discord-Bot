const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes messages')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Amount of messages to delete')
            .setRequired(true)
        ),

        async execute(interaction)
        {
            const amount = interaction.options.getInteger('amount');

            if(!amount)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You must provide amount of messages to delete!")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            if(amount < 1 || amount > 100)
            {
                const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Amount must be between 1 and 100!")
                .setTimestamp()

                interaction.reply({ embeds: [embed] });
                return;
            }

            await interaction.channel.bulkDelete(amount);

            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`${amount} messages deleted!`)
            .setTimestamp()

            await interaction.reply({ embeds: [embed] });

            setTimeout(() => {
                interaction.deleteReply();
            }, 3000);


        }
}