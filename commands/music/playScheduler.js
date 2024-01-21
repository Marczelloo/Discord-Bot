const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

const globals = require('../../global.js');
const { readFile } = require('fs').promises;
const path = require('path');

async function play(scheduleTime) {
    const guilds = globals.client.guilds.cache; // Get all guilds where the bot is present

    for (const guild of guilds) 
    {
        const guildId = guild[0];
        const filePath = path.resolve(__dirname, 'schedulers.json');
        const guildData = await readFile(filePath, 'utf8');
        const parsedData = JSON.parse(guildData);
        console.log(parsedData);
        const guildSchedulers = parsedData.filter(data => data.guildId === guildId);

        if (guildSchedulers[0].schedulers === true) {
            const members = guild[1].members.cache;

            for (const channel of voiceChannels) {
                console.log(voiceChannels);
                if(channel.members.size > 0)
                {
                    console.log("Channel is empty");
                    const voiceChannel = joinVoiceChannel({
                        channelId: channel[0],
                        guildId: guildId,
                        adapterCreator: guild[1].voiceAdapterCreator
                    });
    
                    globals.player = createAudioPlayer();
    
                    let filePath;
                    if (scheduleTime == 'morning') 
                    {
                        filePath = path.resolve(__dirname, '/scheduleersSongs/pierwszyProgramRadia.ogg');
                        globals.queue.push({ title: 'Pierwszy program radia', url: filePath, image: '', length: '' });
                    } 
                    else if (scheduleTime == 'evening') 
                    {
                        Math.random() < 0.5 ? filePath = path.resolve(__dirname, 'schedulersSongs/barka.ogg') : filePath = path.resolve(__dirname, 'schedulersSongs/papiezowa.ogg');
                        globals.queue.push({ title: 'Pierwszy program radia', url: filePath, image: '', length: '' });
                    }
    
                    console.log(globals.queue)
                    console.log(filePath);
                    const p = async () => {
                        try
                        {
                            const resource = createAudioResource(filePath, {
                                inputType: StreamType.OggOpus,
                                inlineVolume: true
                            });
                            
                            globals.resource = resource;
                            globals.resource.volume.setVolume(0.05);
                            voiceChannel.subscribe(globals.player);    
    
                            if (globals.player.state.status === AudioPlayerStatus.Idle) {
                                globals.player.play(resource);
                            }
        
                            globals.isSkipped = false;
                            globals.schedulerPlaying = true;
                                
                        }
                        catch (err)
                        {
                            console.error(err);
                        }
                    }
    
                    p();
    
                    globals.player.on('idle', () => {
                        console.log("Idle");
                        if (globals.queue.length === 0) {
                            console.log("Queue is empty");
                        }
                    });
                }
            }
        }
    }
}

module.exports = {
    schedulePlay: play,
}