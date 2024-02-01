const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

const globals = require('../../global.js');
const { readFile } = require('fs').promises;
const path = require('path');

async function play(scheduleTime) {
    const guilds = globals.client.guilds.cache;

    for (const guild of guilds) 
    {
        const guildId = guild[0];
        const filePath = path.resolve(__dirname, 'schedulers.json');
        const guildData = await readFile(filePath, 'utf8');
        const parsedData = JSON.parse(guildData);
        const guildSchedulers = parsedData.filter(data => data.guildId === guildId);

        if (guildSchedulers[0].schedulers === true) {
            const connection = getVoiceConnection(guildId);
            
            if(connection && connection.state.status === VoiceConnectionStatus.Ready) 
            {
                console.log('The bot is connected to a voice channel.');

                if(globals.player === undefined || globals.player == null)
                {
                    globals.player = createAudioPlayer();
                }

                let filePath;
                if (scheduleTime == 'morning') 
                {
                    filePath = path.resolve(__dirname, '/scheduleersSongs/pierwszyProgramRadia.ogg');
                    globals.queue.push({ title: 'Pierwszy program radia', url: filePath, image: '', length: '' });
                } 
                else if (scheduleTime == 'evening') 
                {
                    const random = Math.random();
                    if(random < 0.5)
                    {
                        filePath = path.resolve(__dirname, 'schedulersSongs/barka.ogg')
                        globals.queue.unshift({ title: 'Barka', url: 'https://youtu.be/A3gQzWmW6Sk?si=EznoGxg-FIezqIaV', image: '', length: '' });
                    }
                    else
                    {
                        filePath = path.resolve(__dirname, 'schedulersSongs/papiezowa.ogg')
                        globals.queue.unshift({ title: 'Papiezowa', url: 'https://youtu.be/2yusdx60_aw?si=a-_aOm6lt_dJNfG7filePath', image: '', length: '' });
                    }                   
                }

                const resource = createAudioResource(filePath, {
                    inputType: StreamType.OggOpus,
                    inlineVolume: true
                });
                
                globals.resource = resource;
                globals.resource.volume.setVolume(0.05);

                globals.player.play(resource);
                
                globals.isSkipped = false;
                globals.schedulerPlaying = true;

            } 
            else 
            {
                console.log('The bot is not connected to a voice channel.');
                const voiceChannels = guild[1].channels.cache.filter(channel => channel.type === 2 && channel.members.size > 0);

                const randomChannel = voiceChannels.random(); 

                if (randomChannel) {
                    const voiceChannel = joinVoiceChannel({
                        channelId: randomChannel.id,
                        guildId: guildId,
                        adapterCreator: guild[1].voiceAdapterCreator
                    });
        
                    if(globals.player === undefined || globals.player == null)
                    {
                        globals.player = createAudioPlayer();
                    }

                    let filePath;
                    if (scheduleTime == 'morning') 
                    {
                        filePath = path.resolve(__dirname, 'schedulersSongs/pierwszyProgramRadia.ogg');
                        globals.queue.push({ title: 'Pierwszy program radia', url: filePath, image: '', length: '' });
                    } 
                    else if (scheduleTime == 'evening') 
                    {
                        const random = Math.random();
                        if(random < 0.5)
                        {
                            filePath = path.resolve(__dirname, 'schedulersSongs/barka.ogg')
                            globals.queue.push({ title: 'Barka', url: filePath, image: '', length: '' });
                        }
                        else
                        {
                            filePath = path.resolve(__dirname, 'schedulersSongs/papiezowa.ogg')
                            globals.queue.push({ title: 'Papiezowa', url: filePath, image: '', length: '' });
                        }                   
                    }

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
                        console.log('idle');

                        globals.queue.shift();
                        if (globals.queue.length === 0) 
                        {
                            voiceChannel.disconnect();
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