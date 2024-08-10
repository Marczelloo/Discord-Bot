const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

const { getServerData, setGlobalVariable, addToQueue, shiftQueue, getClient, QueueType } = require('../global.js');
const { readFile } = require('fs').promises;
const path = require('path');
const Log = require('./fancyLogs/log.js');

async function play(scheduleTime, interacion) {
    const guilds = getClient().guilds.cache;

    Log.info("Playing schedulers", null, null, null);
    for (const guild of guilds) 
    {
        const guildId = guild[0];
        const filePath = path.resolve(__dirname, 'schedulers.json');
        const guildData = await readFile(filePath, 'utf8');
        const parsedData = JSON.parse(guildData);
        const guildSchedulers = parsedData.filter(data => data.guildId === guildId);

        if (guildSchedulers[0].schedulers === true) {
            Log.info("Getting connection", null, guildId, guild[1].name);
            const connection = getVoiceConnection(guildId);
            
            if(connection && connection.state.status === VoiceConnectionStatus.Ready) 
            {
                Log.info("The bot is connected to a voice channel.", null, guildId, guild[1].name);

                if(getServerData(guild.id).player === undefined || getServerData(guild.id).player == null)
                {
                    getServerData(guild.id).player = createAudioPlayer();
                }

                let filePath;
                if (scheduleTime == 'morning') 
                {
                    Log.info("Playing morning schedulers song", null, guildId, guild[1].name);
                    filePath = path.resolve(__dirname, '/scheduleersSongs/pierwszyProgramRadia.ogg');
                    addToQueue(guildId, { title: 'Pierwszy program radia', url: filePath, image: '', length: '' }, QueueType.QUEUE);
                } 
                else if (scheduleTime == 'evening') 
                {
                    const random = Math.random();
                    if(random < 0.5)
                    {
                        Log.info("Playing evening schedulers song", null, guildId, guild[1].name);
                        filePath = path.resolve(__dirname, 'schedulersSongs/barka.ogg')
                        addToQueue(guildId, { title: 'Barka', url: 'https://youtu.be/A3gQzWmW6Sk?si=EznoGxg-FIezqIaV', image: '', length: '' }, QueueType.QUEUE);
                    }
                    else
                    {
                        Log.info("Playing evening schedulers song", null, guildId, guild[1].name);
                        filePath = path.resolve(__dirname, 'schedulersSongs/papiezowa.ogg')
                        addToQueue(guildId, { title: 'Papiezowa', url: 'https://youtu.be/2yusdx60_aw?si=a-_aOm6lt_dJNfG7filePath', image: '', length: '' }, QueueType.QUEUE);
                    }                   
                }

                const resource = createAudioResource(filePath, {
                    inputType: StreamType.OggOpus,
                    inlineVolume: true
                });
                
                setGlobalVariable(guild.id, resource, resource);
                setGlobalVariable(guild.id, 'volume', 0.05);

                Log.info("Playing schedulers song", null, guildId, guild[1].name);
                getServerData(guild.id).player.play(resource);

                setGlobalVariable(guild.id, 'isSkipped', false);
                setGlobalVariable(guild.id, 'schedulerPlaying', true);
            } 
            else 
            {
                Log.info("The bot is not connected to a voice channel.", null, guildId, guild[1].name);
                const voiceChannels = guild[1].channels.cache.filter(channel => channel.type === 2 && channel.members.size > 0);

                const randomChannel = voiceChannels.random(); 

                if (randomChannel) {
                    Log.ingo("Connecting to voice channel", null, guildId, guild[1].name);
                    const voiceChannel = joinVoiceChannel({
                        channelId: randomChannel.id,
                        guildId: guildId,
                        adapterCreator: guild[1].voiceAdapterCreator
                    });
        
                    if(getServerData(guildId).player === undefined || getServerData(guildId).player == null)
                    {
                        getServerData(guildId).player = createAudioPlayer();
                    }

                    let filePath;
                    if (scheduleTime == 'morning') 
                    {
                        Log.info("Playing morning schedulers song", null, guildId, guild[1].name);
                        filePath = path.resolve(__dirname, 'schedulersSongs/pierwszyProgramRadia.ogg');
                        addToQueue(guildId, { title: 'Pierwszy program radia', url: filePath, image: '', length: '' }, QueueType.QUEUE);
                    } 
                    else if (scheduleTime == 'evening') 
                    {
                        const random = Math.random();
                        if(random < 0.5)
                        {
                            Log.info("Playing evening schedulers song", null, guildId, guild[1].name);
                            filePath = path.resolve(__dirname, 'schedulersSongs/barka.ogg');
                            addToQueue(guildId, { title: 'Barka', url: filePath, image: '', length: '' }, QueueType.QUEUE);
                        }
                        else
                        {
                            Log.info("Playing evening schedulers song", null, guildId, guild[1].name);
                            filePath = path.resolve(__dirname, 'schedulersSongs/papiezowa.ogg')
                            addToQueue(guildId, { title: 'Papiezowa', url: filePath, image: '', length: '' }, QueueType.QUEUE);
                        }                   
                    }

                    const p = async () => {
                        try
                        {
                            const resource = createAudioResource(filePath, {
                                inputType: StreamType.OggOpus,
                                inlineVolume: true
                            });
                            
                            setGlobalVariable(guildId, 'resource', resource);
                            setGlobalVariable(guildId, 'volume', 0.05);
                          
                            voiceChannel.subscribe(getServerData(guildId).player);    

                            if (getServerData(guildId).player.state.status === AudioPlayerStatus.Idle) {
                                Log.info("Playing schedulers song", null, guildId, guild[1].name);
                                getServerData(guildId).player.play(resource);
                            }
        
                            setGlobalVariable(guildId, 'isSkipped', false);
                            setGlobalVariable(guildId, 'schedulerPlaying', true);                       
                        }
                        catch (err)
                        {
                            Log.error("Error playing schedulers song", err, guildId, guild[1].name);
                        }
                    }

                    p();

                    getServerData(guildId).player.on('idle', () => {
                        Log.info("Player is idle", null, guildId, guild[1].name);

                        shiftQueue(guildId, QueueType.QUEUE);
                        if (getServerData(guildId).queue.length === 0) 
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