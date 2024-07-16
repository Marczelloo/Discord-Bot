const { EmbedBuilder } = require("discord.js");

module.exports = {
   songEmed: function(song) {
      return new EmbedBuilder()
      .setColor(0x00ff00)
      .setAuthor({ name: 'Song added to queue:' })
      .setTitle(song.title)
      .setURL(song.url)
      .setImage(song.image)
      .setFooter({ text: "Author: " + song.artist, iconURL: song.artist_url })
      .setTimestamp();
   }
}