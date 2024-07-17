const fs = require('fs');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, clearGlobalVariables } = require('../../global.js');
const path = require('path');

function vcLeaveReset(guildId)
{
    if(!getServerData(guildId).player == null)
    {
        getServerData(guildId).player.stop();
    }

    clearGlobalVariables(guildId);

    const filePath = path.resolve(__dirname, "../../temp/output_" + guildId + ".ogg");
    const filePathEQ = path.resolve(__dirname, "../../temp/outputEQ_" + guildId + ".ogg");
    
    fs.access(filePath, fs.F_OK, (err) => {
        if(err) {
            console.error(err);
            return;
        }

        fs.unlink(filePath, (err) => {
            if(err) {
                console.error(err);
                return;
            }

            console.log("Successfully deleted output.ogg");
        });
    });

    fs.access(filePathEQ, fs.F_OK, (err) => {
        if(err) {
            console.error(err);
            return;
        }

        fs.unlink(filePathEQ, (err) => {
            if(err) {
                console.error(err);
                return;
            }

            console.log("Successfully deleted outputEQ.ogg");
        });
    })

}

module.exports = vcLeaveReset;