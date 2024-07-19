const Log = require("./fancyLogs/log");

module.exports = {
   testLink: function(query, interacion) {
      const linkRegex = /((http|https):\/\/(www\.)?[\w\-_]+(\.[\w\-_]+)*([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/gi;

      const linkMatch = linkRegex.test(query);
      
      if(linkMatch)
      {
         Log.info("Query type: Link", null, interacion.guild.id, interacion.guild.name);
         return {
            type: "link",
            query: query,
         }
      }
      else
      {
         Log.info("Query type: Song name", null, interacion.guild.id, interacion.guild.name);
         return {
            type: "title",
            query: query,
         }
      }
   }
}