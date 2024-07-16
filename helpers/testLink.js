module.exports = {
   testLink: function(query) {
      const linkRegex = /((http|https):\/\/(www\.)?[\w\-_]+(\.[\w\-_]+)*([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/gi;

      const linkMatch = linkRegex.test(query);
      
      if(linkMatch)
      {
         console.log("Query type: Link");
         return {
            type: "link",
            query: query,
         }
      }
      else
      {
         console.log("Query type: Song name");
         return {
            type: "title",
            query: query,
         }
      }
   }
}