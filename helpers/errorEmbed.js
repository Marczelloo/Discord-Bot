const { EmbedBuilder } = require('discord.js');

module.exports = {
   errorEmbed: function(title) {
      return new EmbedBuilder()
         .setColor(0xff0000)
         .setTitle(title)
         .setTimestamp()
   }
}