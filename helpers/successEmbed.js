const { EmbedBuilder } = require("discord.js")

module.exports = {
   successEmbed: function(title) {
      return new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle(title)
      .setTimestamp();
   }
}