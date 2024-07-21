const { AudioPlayerStatus } = require("@discordjs/voice");
const { getServerData, LoopType } = require("../global");

module.exports = {
   nowPlayingEmbedFields: function(guildId, song, formattedTime) {
      return [
         { name: 'Length: ', value: formattedTime, inline: true },
         { name: 'Status', value: getServerData(guildId).player === AudioPlayerStatus.Playing ? 'Playing' : 'Paused' , inline: true },
         { name: 'Loop: ', value: getServerData(guildId).loop === LoopType.NO_LOOP ? 'No loop' 
            : getServerData(guildId).loop === LoopType.LOOP_SONG ? 'Song loop' 
            : 'Queue loop', inline: true },
         { name: 'Volume: ', value: getServerData(guildId).resource ? getServerData(guildId).resource.volume.volume * 100 : '5', inline: true },
         { name: 'EQ: ', value: getServerData(guildId).eqEffect ? getServerData(guildId).eqEffect : 'None', inline: true },
         { name: 'Shuffle: ', value: getServerData(guildId).shuffle ? 'On' : 'Off', inline: true }
      ];
   }
}