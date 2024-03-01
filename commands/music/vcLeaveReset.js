const fs = require('fs');
const { AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');

function vcLeaveReset()
{
    if(!globals.player == null)
    {
        globals.player.stop();
    }
  
    globals.player = null;
    globals.resource = null;
    globals.queue = [];
    globals.playedSongs = [];
    globals.firstCommandTimestamp = null;
    globals.nowPlayingMessage = null;
    globals.eqEffect = null;
    globals.loop = globals.LoopType.NO_LOOP;
    globals.shuffle = false;
    globals.isSkipped = false;
    globals.schedulerPlaying = false;
    globals.timeout = null;
    globals.autoplay = false;
    
    
    fs.access(__dirname + "/output.ogg", fs.F_OK, (err) => {
        if(err) {
            console.error(err);
            return;
        }

        fs.unlink(__dirname + "/output.ogg", (err) => {
            if(err) {
                console.error(err);
                return;
            }

            console.log("Successfully deleted output.ogg");
        });
    });

}

module.exports = vcLeaveReset;