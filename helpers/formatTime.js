module.exports = {
   formatTime: function(length) {
      const lengthInSeconds = length;
      const minutes = Math.floor(lengthInSeconds / 60);
      const seconds = lengthInSeconds % 60;
      let formattedLength = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;   

      if(minutes >= 60) {
         const hours = Math.floor(minutes / 60);
         const remainingMinutes = minutes % 60;
         formattedLength = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      
      return formattedLength;
   }
}