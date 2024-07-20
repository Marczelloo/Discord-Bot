const fs = require('fs');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, clearGlobalVariables } = require('../global.js');
const path = require('path');
const Log = require('./fancyLogs/log.js');

async function vcLeaveReset(guildId)
{
    if(!getServerData(guildId).player == null)
    {
        await getServerData(guildId).player.stop();
    }

    clearGlobalVariables(guildId);

    const filePath = path.resolve(__dirname, "../temp/output_" + guildId + ".ogg");
    const filePathEQ = path.resolve(__dirname, "../temp/outputEQ_" + guildId + ".ogg");
    
    fs.access(filePath, fs.F_OK, (err) => {
        if(err) {
            Log.error("Error output.ogg does not exist", err, guildId);
            return;
        }

        fs.unlink(filePath, (err) => {
            if(err) {
                Log.error("Error deleting output.ogg", err, guildId);
                return;
            }

            Log.success("Successfully deleted output.ogg", null, guildId);
        });
    });

    fs.access(filePathEQ, fs.F_OK, (err) => {
        if(err) {
            Log.error("Error outputEQ.ogg does noe exist", err, guildId);
            return;
        }

        fs.unlink(filePathEQ, (err) => {
            if(err) {
                Log.error("Error deleting outputEQ.ogg", err, guildId);
                return;
            }

            Log.success("Successfully deleted outputEQ.ogg", null, guildId);
        });
    })

}

module.exports = vcLeaveReset;