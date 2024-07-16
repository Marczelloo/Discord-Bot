module.exports = {
   fetchSpotifySong: async function(url, interaction) {
      await interaction.editReply({ embeds: [ errorEmbed("Spotify song fetching is not implemented yet") ] });
      return;
   }
}