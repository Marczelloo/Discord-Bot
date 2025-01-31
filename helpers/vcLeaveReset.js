const fs = require('fs');
const { AudioPlayerStatus } = require('@discordjs/voice');

const { getServerData, setGlobalVariable, clearGlobalVariables, LoopType } = require('../global.js');
const path = require('path');
const Log = require('./fancyLogs/log.js');

async function vcLeaveReset(guildId)
{
    try
    {
        if(getServerData(guildId).player != null)
        {
            await getServerData(guildId).player.stop();
        }

        setGlobalVariable(guildId, 'queue', []);
        setGlobalVariable(guildId, 'originalQueue', []);
        setGlobalVariable(guildId, 'playedSongs', []);
        setGlobalVariable(guildId, 'isSkipped', true);
        setGlobalVariable(guildId, 'loop', LoopType.NO_LOOP);
        setGlobalVariable(guildId, 'shuffle', false);
        setGlobalVariable(guildId, 'playEarlier', false);
        setGlobalVariable(guildId, 'ageRestricted', false);
        setGlobalVariable(guildId, 'resource', null);   
        setGlobalVariable(guildId, 'client', null);
        setGlobalVariable(guildId, 'eqEffect', null);
        
        
    
        const filePath = path.resolve(__dirname, "../temp/output_" + guildId + ".ogg");
        const filePathEQ = path.resolve(__dirname, "../temp/outputEQ_" + guildId + ".ogg");

        while(getServerData(guildId).player != null && getServerData(guildId).player.state.status !== AudioPlayerStatus.Idle)
        {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    
        if(fs.existsSync(filePath))
        {
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
        }
    
        if(fs.existsSync(filePathEQ))
        {
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
    }
    catch(error)
    {
        Log.error("Error leaving voice channel and deleting output files", error, guildId);
    }
}

module.exports = vcLeaveReset;