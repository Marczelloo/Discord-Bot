const { EmbedBuilder } = require("discord.js");

module.exports = { 
   playerEmbed: function(title, url, image, artist, artist_url) {
      return new EmbedBuilder()
      .setColor(0x00ff00)
      .setAuthor({ name: 'Now playing:'})
      .setTitle(title)
      .setURL(url)
      .setImage(image)
      .setFooter({ text: "Author: " + artist, iconURL: artist_url })
      .setTimestamp();
   },
   successEmbed: function(title) {
      return new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle(title)
      .setTimestamp();
   },
   errorEmbed: function(title) {
      return new EmbedBuilder()
         .setColor(0xff0000)
         .setTitle(title)
         .setTimestamp()
   },
   songEmbed: function(song) {
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