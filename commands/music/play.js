const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { spotify_clientID, spotify_clientSecret } = require('../../config.json');

const YouTube = require('youtube-sr').default;
const ytdl = require("@distube/ytdl-core");
const ytsr = require('ytsr');
const fs = require('fs');
const path = require('path');
const util = require('util');

const { getServerData, setGlobalVariable }  = require('../../global.js');

const { bassBoost, bassBoostV2, earrape, nightcore, slowReverb, eightBit, dolbyRetardos, inverted, toiletAtClub } = require('./eqFunctions.js');
const { setTimeout } = require('timers');
const { createButton } = require('../../helpers/createButton.js');
const { testLink } = require('../../helpers/testLink.js');
const { errorEmbed } = require('../../helpers/errorEmbed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play song from YouTube')
        .addStringOption(option => option
            .setName('query')
            .setDescription('Song name, YouTube URL or Spotify URL')
            .setRequired(true)
        ),

    async execute(interaction) 
    {
        if(globals.firstCommandTimestamp == null)
        {
            globals.firstCommandTimestamp = Date.now();
        }
        
        await interaction.deferReply();

        const playingRow = new ActionRowBuilder();
        const pausedRow = new ActionRowBuilder();
        const disabledButtons = new ActionRowBuilder();

        const skipButton = createButton('skip-button', ButtonStyle.Secondary, '1198248590087307385');
        const disabledSkipButton = createButton('skip-button', ButtonStyle.Secondary, '1198248590087307385', true);
        const rewindButton = createButton('rewind-button', ButtonStyle.Secondary, '1198248587369386134');
        const disabledRewindButton = createButton('rewind-button', ButtonStyle.Secondary, '1198248587369386134', true);
        const pauseButton = createButton('pause-button', ButtonStyle.Danger, '1198248585624571904');
        const disabledPauseButton = createButton('pause-button', ButtonStyle.Danger, '1198248585624571904', true);
        const resumeButton = createButton('resume-button', ButtonStyle.Success, '1198248583162511430');
        const loopButton = createButton('loop-button', ButtonStyle.Primary, '1198248581304418396');
        const disabledLoopButton = createButton('loop-button', ButtonStyle.Primary, '1198248581304418396', true);
        const shuffleButton = createButton('shuffle-button', ButtonStyle.Primary, '1198248578146115605')
        const disabledshuffleButton = createButton('shuffle-button', ButtonStyle.Primary, '1198248578146115605', true);
        
        playingRow.addComponents([rewindButton, skipButton, pauseButton, loopButton, shuffleButton]);
        pausedRow.addComponents([rewindButton, skipButton, resumeButton, loopButton, shuffleButton]);
        disabledButtons.addComponents([disabledRewindButton, disabledSkipButton, disabledPauseButton, disabledLoopButton, disabledshuffleButton]);

        const query = await interaction.options.getString('query');

        const song = testLink(query);
       
        const voiceChannel = await interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.editReply({ embeds: [errorEmbed("You need to be in a voice channel to play music")]});
            return;
        }

        if (!query) {
            await interaction.editReply({ embeds: [errorEmbed("Please provide a song name, YouTube URL or Spotify URL")]});
            return;
        }
        
        setGlobalVariable(interaction.guild.id, 'commandChannel', interaction.channel);

        if(song.type === "link")
            processUrlSong(song.query, interaction);
        
        if(song.type === "title")
            processTitleSong(song.query, interaction);

        // if (url) {
        //     const isSpotifyUrl = url.includes('spotify');
        //     const isYoutubeUrl = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[^&]+|youtu\.be\/[^&]+)/.test(url);

        //     let songInfo;
        //     let playlist;

        //     if (isSpotifyUrl) 
        //     {
        //         const spotifyPlaylistPattern = /^https?:\/\/(open\.)?spotify\.com\/playlist\/[a-zA-Z0-9]+\?/;
        //         console.log(spotifyPlaylistPattern.test(url));

        //         if (spotifyPlaylistPattern.test(url)) 
        //             playlist = true;
        //         else
        //             playlist = false;

        //         if(globals.spotify_token_expires < Date.now() || globals.spotify_token === null)
        //         {
        //             try
        //             { 
        //                 const reposne = await fetch('https://accounts.spotify.com/api/token', {
        //                     method: 'POST',
        //                     headers: {
        //                         'Content-Type': 'application/x-www-form-urlencoded',
        //                     },
        //                     body: new URLSearchParams({
        //                         grant_type: 'client_credentials',
        //                         client_id: spotify_clientID,
        //                         client_secret: spotify_clientSecret
        //                     }),
        //                 });

        //                 const data = await reposne.json();
        //                 if(data.error)
        //                 {
        //                     console.error("Error obtaining spotify token: " + data.error);
        //                     const embed = new EmbedBuilder()
        //                     .setColor(0xff0000)
        //                     .setTitle("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json")
        //                     .setTimestamp()

        //                     await interaction.editReply({ embeds: [embed] });
        //                     return;
        //                 }
        //                 globals.spotify_token = data.access_token;
        //                 globals.spotify_token_expires = Date.now() + (data.expires_in * 1000);
        //             }
        //             catch(err)
        //             {
        //                 console.error("Error obtaining spotify token: " + err);
        //                 const embed = new EmbedBuilder()
        //                 .setColor(0xff0000)
        //                 .setTitle("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json or try again later")
        //                 .setTimestamp()

        //                 await interaction.editReply({ embeds: [embed] });
        //                 return;
        //             }
        //         }

        //         if(playlist)
        //         { 
        //             const playlistId = url.split('/').pop();
        //             console.log(playlistId);
        //             const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        //             try 
        //             {
        //                 const response = await fetch(apiUrl, {
        //                     headers: {
        //                         'Authorization': `Bearer ${globals.spotify_token}`
        //                     }
        //                 });

        //                 const data = await response.json();
        //                 const tracks = data.tracks.items;

        //                 globals.ageRestricted = false;

        //                 await Promise.all(tracks.map(async track => {
        //                     const time = track.track.duration_ms / 1000;
        //                     const formatedTime = time.toString().includes(":") ? time : new Date(time * 1000).toISOString().substr(time < 3600 ? 14 : 11, 5);
                            
        //                     const newSong = {
        //                         title: track.track.name,
        //                         artist: track.track.artists[0].name,
        //                         artist_url: track.track.artists[0].external_urls.spotify,
        //                         url: track.track.external_urls.spotify,
        //                         image: track.track.album.images[0].url,
        //                         length: formatedTime,
        //                     };

        //                     globals.queue.push(newSong);
        //                 }));
                        
        //                 const embed = new EmbedBuilder()
        //                 .setColor(0x00ff00)
        //                 .setTitle('Song are proccessing they will be added in a while')
        //                 .setTimestamp()
                        
        //                 console.log("Adding playlist to song queue by spotify URL");

        //                 await interaction.editReply({ embeds: [embed] });
        //             } 
        //             catch (error) 
        //             {
        //                 console.error("Error retrieving Spotify playlist tracks:", error);
        //                 const embed = new EmbedBuilder()
        //                     .setColor(0xff0000)
        //                     .setTitle("Error retrieving Spotify playlist tracks")
        //                     .setTimestamp();

        //                 await interaction.editReply({ embeds: [embed] });
        //                 return;
        //             }       
        //         }
        //         else
        //         {
        //             console.log("Spotify song processing");
        //         }
        //     } 
        //     else if(isYoutubeUrl) 
        //     {
        //         const youtubePlaylistPattern = url.includes('list');

        //         if (youtubePlaylistPattern) 
        //             playlist = true;
        //         else
        //             playlist = false;

        //         console.log(playlist);

        //         if(playlist)
        //         {
        //             const regex = /list=([a-zA-Z0-9_-]+)/;
        //             const match = url.match(regex);
        //             if (match) 
        //             {
        //                 try
        //                 {
        //                     const playlistId = match[1];
        //                     console.log(`Playlist ID: ${playlistId}`);
    
        //                     const playlist = await YouTube.getPlaylist(playlistId);
        //                     const videos = await new Promise((resolve, reject) => {
        //                         playlist.fetch()
        //                             .then(videos => resolve(videos))
        //                             .catch(error => reject(error));
        //                     });
    
        //                     const videosArray = Array.from(videos);
    
        //                     globals.ageRestricted = false;
    
        //                     await Promise.all(videosArray.map(video => {
        //                         const newSong = {
        //                             title: video.title,
        //                             artist: video.channel.name,
        //                             artist_url: video.channel.icon.url,
        //                             url: video.url,
        //                             image: video.thumbnail.url,
        //                             length: video.durationFormatted,
        //                         };
    
        //                         globals.queue.push(newSong);
        //                     }));
    
        //                     const embed = new EmbedBuilder()
        //                     .setColor(0x00ff00)
        //                     .setTitle('Playlist added to queue')
        //                     .setTimestamp()
    
        //                     console.log("Adding playlist to song queue by URL");

        //                     await interaction.editReply({ embeds: [embed] });
        //                 }
        //                 catch(err)
        //                 {
        //                     console.error("Error adding playlist to queue: " + err);
        //                     const embed = new EmbedBuilder()
        //                     .setColor(0xff0000)
        //                     .setTitle("Error adding playlist to queue, if the playlist is private, age restricted or your mix, the bot can't add it to the queue")
        //                     .setTimestamp();

        //                     await interaction.editReply({ embeds: [embed] });
        //                 }
        //             } 
        //             else 
        //             {
        //                 console.log('No playlist ID found in the URL');
        //             }
        //         }
        //         else
        //         {
        //             songInfo = await YouTube.getVideo(url);
                    
        //             if(songInfo.nsfw)
        //                 globals.ageRestricted = true;
        //             else
        //                 globals.ageRestricted = false;
                    
        //             if(songInfo === null || songInfo === undefined)
        //             {
        //                 const embed = new EmbedBuilder()
        //                 .setColor(0xff0000)
        //                 .setTitle("No search results found for the song")
        //                 .setTimestamp();
                        
        //                 console.log("No search results found for the song by URL");
        //                 await interaction.editReply({ embeds: [embed] });
        //                 return;
        //             }
        //             else if(songInfo.live)
        //             {
        //                 const embed = new EmbedBuilder()
        //                 .setColor(0xff0000)
        //                 .setTitle("You can't play live content")
        //                 .setTimestamp()
        
        //                 console.log("You can't play live content");
        //                 await interaction.editReply({ embeds: [embed] });
        //                 return;
        //             }
        //             else 
        //             {
        //                 const newSong = {
        //                     title: songInfo.title,
        //                     artist: songInfo.channel.name,
        //                     artist_url: songInfo.channel.icon.url,
        //                     url: url,
        //                     image: songInfo.thumbnail.url,
        //                     length: songInfo.durationFormatted,
        //                 };
                        
        //                 globals.queue.push(newSong);
                        
        //                 const embed = new EmbedBuilder()
        //                 .setColor(0x00ff00)
        //                 .setAuthor({ name: 'Song added to queue:' })
        //                 .setTitle(newSong.title)
        //                 .setURL(newSong.url)
        //                 .setImage(newSong.image)
        //                 .setFooter({ text: "Author: " + newSong.artist, iconURL: newSong.artist_url })
        //                 .setTimestamp()
            
        //                 console.log("Adding song to song queue by URL");

        //                 await interaction.editReply({ embeds: [embed] });
        //             }       
        //         }
        //     } 
        //     else 
        //     {
        //         const embed = new EmbedBuilder()
        //             .setColor(0xff0000)
        //             .setTitle("Invalid URL")
        //             .setTimestamp();

        //         await interaction.editReply({ embeds: [embed] });
        //         return;
        //     }            
        // }

        // if (song) 
        // {
        //     const findSongByName = async (song, voiceCom) => {
        //         const searchResults = await ytsr(song, { limit: 1 });
        //         const video = searchResults.items[0];
                            
        //         await YouTube.getVideo(video.url)
        //         .then(video => {
        //             if(video.nsfw)
        //                 globals.ageRestricted = true;
        //             else
        //                 globals.ageRestricted = false;
        //         })
        //         .catch(console.error);
    
        //         if (!video) {
        //             const embed = new EmbedBuilder()
        //             .setColor(0xff0000)
        //             .setTitle("No search results found for the song")
        //             .setTimestamp();
                    
        //             console.log("No search results found for the song by name");
        //             await interaction.editReply({ embeds: [embed] });
        //             return;
        //         }
    
        //         if(searchResults.items[0].type === 'live')
        //         {
        //             const embed = new EmbedBuilder()
        //             .setColor(0xff0000)
        //             .setTitle("You can't play live content")
        //             .setTimestamp()
    
        //             console.log("You can't play live content");
        //             await interaction.editReply({ embeds: [embed] });
        //             return;
        //         }
        //         else
        //         {
        //             const newSong = {
        //                 title: video.title,
        //                 artist: video.author.name,
        //                 artist_url: video.author.bestAvatar.url,
        //                 url: video.url,
        //                 image: video.bestThumbnail.url,
        //                 length: video.duration,
        //             };
        
       
        //             const embed = new EmbedBuilder()
        //             .setColor(0x00ff00)
        //             .setAuthor({ name: 'Song added to queue:' })
        //             .setTitle(newSong.title)
        //             .setURL(newSong.url)
        //             .setImage(newSong.image)
        //             .setFooter({ text: "Author: " + newSong.artist, iconURL: newSong.artist_url })
        //             .setTimestamp()

        //             console.log("Adding song to song queue by name");

        //             if(voiceCom)
        //             {
        //                 await globals.commandChannel.send({ embeds: [embed] });
        //             }
        //             else
        //             {
        //                 await interaction.editReply({ embeds: [embed] });
        //             }
        //         }
        //     }

        //     await findSongByName(song, false);

        //     module.exports = findSongByName;            
        // }

        //globals.guildId = interaction.guild.id;

        if(getServerData(interaction.guild.id).queue.length >= 1)
            playSong(interaction, voiceChannel);

        if (globals.queue.length >= 1) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
        
            if(globals.player == null) 
            {
                globals.player = createAudioPlayer();
            }

            let outputFilePath;

            async function playNextSong() {
                if (globals.queue.length === 0) {
                    globals.player.stop();
                    return;
                }


                let formattedTime;
                if(globals.queue[0].length.toString().includes(":"))
                {
                    formattedTime = globals.queue[0].length;
                }
                else
                {
                    const lengthInSeconds = globals.queue[0].length;
                    const minutes = Math.floor(lengthInSeconds / 60);
                    const seconds = lengthInSeconds % 60;
                    const formattedLength = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
                    if (minutes >= 60) {
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = minutes % 60;
                        formattedTime = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    } 
                    else 
                    {
                        formattedTime = formattedLength;
                    }
                }

                if(globals.queue[0].url.includes('spotify'))
                {
                    const video = await ytsr(globals.queue[0].title + " "  + globals.queue[0].artist, { limit: 1 });
                    const videoInfo = video.items[0];

                    globals.queue[0].yt_url = videoInfo.url;
                    globals.queue[0].length = videoInfo.duration;
                    globals.queue[0].artist_url = videoInfo.author.bestAvatar.url;
                }

                const nowPlayingEmbedFields = [
                    { name: 'Length: ', value: formattedTime, inline: true },
                    { name: 'Status', value: globals.player.state.status === AudioPlayerStatus.Playing ? 'Playing' : 'Paused' , inline: true },
                    { name: 'Loop: ', value: globals.loop === globals.LoopType.NO_LOOP ? 'No loop' : globals.loop === globals.LoopType.LOOP_SONG ? 'Song loop' : 'Queue loop', inline: true },
                    { name: 'Volume: ', value: globals.resource ? globals.resource.volume.volume * 100 : '5', inline: true },
                    { name: 'EQ: ', value: globals.eqEffect ? globals.eqEffect : 'None', inline: true },
                    { name: 'Shuffle: ', value: globals.shuffle ? 'On' : 'Off', inline: true }]
                
                const nowPlayingEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setAuthor({ name: 'Now playing:' })
                .setTitle(globals.queue[0].title)
                .setURL(globals.queue[0].url)
                .setImage(globals.queue[0].image)
                .setFooter({ text: "Author: " + globals.queue[0].artist, iconURL: globals.queue[0].artist_url })
                .setTimestamp()
                
                outputFilePath = path.resolve(__dirname, 'output.ogg');  

                if(globals.ageRestricted)
                {
                    const exec = util.promisify(require('child_process').exec);

                    async function executeCommand(command) 
                    {
                        try 
                        {
                            const { stdout, stderr } = await exec(command);
                            console.log(`Audio downloaded successfully: ${stdout}`);
                            play();
                        } 
                        catch (error) 
                        {
                            console.error(`Error executing command: ${error}`);
    
                            const embed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle("Error downloading audio")
                            .setTimestamp()
                            
                            await interaction.editReply({ embeds: [embed] });
                            globals.queue.shift();
                            playNextSong();
                        }
                    }
    
                    const ytdlp_path = `"${path.resolve(__dirname, "yt-dlp.exe")}"`;
                    const outputPath = `"${path.resolve(__dirname, "output")}"`;
                    const command = `${ytdlp_path} -x --audio-format vorbis -o ${outputPath} ${globals.queue[0].url}`;
                    console.log("Age restricted song processing");
                    await executeCommand(command);
                    console.log("Age restricted song processed");
                }
                else
                { 
                    try 
                    {
                        console.log("Downloading audio");
                        let stream;

                        if(globals.queue[0].url.includes('spotify'))
                            stream = ytdl(globals.queue[0].yt_url, { filter: 'audioonly', quality: 'highestaudio' });
                        else
                            stream = ytdl(globals.queue[0].url, { filter: 'audioonly', quality: 'highestaudio' });

                        stream.on('error', error => {
                            console.error(`Stream error: ${error.message}`);
                        });

                        const writer = stream.pipe(fs.createWriteStream(outputFilePath));

                        let totalSize = 0;
                        stream.on('response', (res) => {
                            totalSize = res.headers['content-length'];
                        });

                        let downloadedSize = 0;
                        stream.on('data', (chunk) => {
                            downloadedSize += chunk.length;
                            const progress = (downloadedSize / totalSize) * 100;
                            process.stdout.clearLine();
                            process.stdout.cursorTo(0);
                            process.stdout.write(`Downloading: ${progress.toFixed(2)}%`);
                        });

                        writer.on('finish', () => {
                            console.log("\nAudio downloaded successfully");
                            play();
                        });

                        writer.on('error', error => {
                            console.error(`Write stream error: ${error.message}`);
                        });
                    } 
                    catch (error) 
                    {
                        console.error("Error downloading audio: " + error);
                        const embed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle("Error downloading audio")
                            .setTimestamp();

                        await interaction.editReply({ embeds: [embed] });
                        globals.queue.shift();
                        playNextSong();
                    }
                }

                async function play()  {
                    const eq = globals.eqEffect;
                
                    if(eq)
                    {
                        console.log("Applying EQ effect: " + eq);
                        switch(eq)
                        {
                            case 'bassboost':
                                await bassBoost();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case 'bass-v2':
                                await bassBoostV2();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case 'earrape':
                                await earrape();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case 'nightcore':
                                await nightcore();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case 'slowReverb':
                                await slowReverb();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case 'eightBit':
                                await eightBit();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case "dolbyRetardos":
                                await dolbyRetardos();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case "inverted":
                                await inverted();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            case "toiletAtClub":
                                await toiletAtClub();
                                outputFilePath = path.resolve(__dirname, "eqOutput.ogg");
                                break;
                            default:
                                break;
                        }
                        console.log("EQ effect applied");
                    }

                    const resource = createAudioResource(outputFilePath, { inputType: StreamType.OggOpus, inlineVolume: true });
                    resource.volume.setVolume(0.05);

                    globals.resource = resource;

                    globals.player.play(resource);
                    connection.subscribe(globals.player);
                    globals.isSkipped = false;

                    nowPlayingEmbedFields[1].value = 'Playing';
                    nowPlayingEmbedFields[3].value = (globals.resource.volume.volume * 100).toString();
                    nowPlayingEmbed.addFields(nowPlayingEmbedFields);
                    
                    if (globals.nowPlayingMessage) 
                    {
                        console.log("Now playing message exists, updating it");
                        await interaction.channel.messages.fetch(globals.nowPlayingMessage)
                            .then(async message => {
                                if (message) message.delete().catch(console.error);

                                try
                                {
                                    if(globals.player.AudioPlayerStatus === AudioPlayerStatus.Paused)
                                    {
                                        globals.coll = await interaction.channel.send({ embeds: [nowPlayingEmbed], components: [pausedRow], position: 'end' })
                                        .then(nowPlayingMessage => {
                                            globals.nowPlayingMessage = nowPlayingMessage.id;
                                            globals.playerMessage = nowPlayingMessage;
                                        })
                                        .catch(console.error);
                                    }
                                    else
                                    {
                                        globals.coll = await interaction.channel.send({ embeds: [nowPlayingEmbed], components: [playingRow], position: 'end' })
                                        .then(nowPlayingMessage => {
                                            globals.nowPlayingMessage = nowPlayingMessage.id;
                                            globals.playerMessage = nowPlayingMessage;
                                        })
                                        .catch(console.error);
                                    }
                                }
                                catch(err)
                                {
                                    if (err.code === 10008) 
                                    {
                                        console.error("The message has already been deleted or does not exist.");
                                    } 
                                    else 
                                    {
                                        console.error(err);
                                    }
                                }
                            }).catch(console.error);
                    }
                    else
                    {
                        if (globals.player.AudioPlayerStatus === AudioPlayerStatus.Paused) 
                        {
                            console.log("Sending paused message");
                            globals.coll = await interaction.channel.send({ embeds: [nowPlayingEmbed], components: [pausedRow], position: 'end' })
                                .then(nowPlayingMessage => {
                                    globals.nowPlayingMessage = nowPlayingMessage.id;
                                    globals.playerMessage = nowPlayingMessage;
                                })
                                .catch(console.error);
                        } 
                        else 
                        {
                            console.log("Sending playing message");
                            await interaction.channel.send({ embeds: [nowPlayingEmbed], components: [playingRow], position: 'end' })
                                .then(nowPlayingMessage => {
                                    globals.nowPlayingMessage = nowPlayingMessage.id;
                                    globals.playerMessage = nowPlayingMessage;
                                })
                                .catch(console.error);
                                
                        }
                    }
                    

                    const filter = () => true;
                    try
                    {
                        let collector;
                        try
                        {
                            collector = await globals.playerMessage.createMessageComponentCollector({ filter, time: null });
                            //collector = await interaction.channel.createMessageComponentCollector({ filter, time: null });
                        }
                        catch(e)
                        {
                            console.error("Error creating collector: ");
                            console.error(e);

                            collector = globals.commandChannel.createMessageComponentCollector({ filter, time: null });
                        }

                        collector.on('collect', async(confirmation) => {
                            if(confirmation.customId === 'rewind-button')
                            {
                                if(globals.playedSongs.length === 0)
                                {
                                    console.log("Rewind button clicked. No previous songs in queue, rewinding to the beginning of the song");
                                    globals.queue.unshift(globals.queue[0])
                                    collector.stop();
                                    globals.player.stop();
                                    
                                    try
                                    {
                                        await confirmation.update({ embeds: [nowPlayingEmbed], components:[disabledButtons], position: 'end' });
                                    }
                                    catch(err)
                                    {
                                        console.error("Error updating message: ");
                                        console.error(err);

                                        await globals.playerMessage.edit({ embeds: [nowPlayingEmbed], components:[disabledButtons], position: 'end' });
                                    }   

                                    return;
                                }
                            
                                console.log("Rewind button clicked. Rewinding to the previous song");
                                globals.playEarlier = true;
                                
                                globals.player.stop();
                                
                                nowPlayingEmbedFields[1].value = 'Playing';
                                nowPlayingEmbed.setFields(nowPlayingEmbedFields);
                                collector.stop();

                                try
                                {
                                    await confirmation.update({ embeds: [nowPlayingEmbed], components:[disabledButtons], position: 'end' });
                                }
                                catch(err)
                                {
                                    console.error("Error updating message: ");
                                    console.error(err);

                                    await globals.playerMessage.edit({ embeds: [nowPlayingEmbed], components:[disabledButtons], position: 'end' });
                                }                               }
                            else if(confirmation.customId === "skip-button")
                            {
                                console.log("Skip button clicked. Skipping the song");
                                collector.stop();
                                globals.player.stop();

                                try
                                {
                                    await confirmation.update({ embeds: [nowPlayingEmbed], components:[disabledButtons], position: 'end' });
                                }
                                catch(err)
                                {
                                    console.error("Error updating message: ");
                                    console.error(err);

                                    collector.stop();
                                    globals.player.stop();

                                    await globals.playerMessage.edit({ embeds: [nowPlayingEmbed], components:[disabledButtons], position: 'end' });
                                }   
                            }
                            else if(confirmation.customId === "pause-button")
                            {
                                console.log("Pause button clicked. Pausing the song");
                                globals.player.pause();

                                nowPlayingEmbedFields[1].value = 'Paused';
                                nowPlayingEmbed.setFields(nowPlayingEmbedFields);

                                try
                                {
                                    await confirmation.update({ embeds: [nowPlayingEmbed], components: [pausedRow], position: 'end' });
                                }
                                catch(err)
                                {
                                    console.error("Error updating message: ");
                                    console.error(err);

                                    await globals.playerMessage.edit({ embeds: [nowPlayingEmbed], components: [pausedRow], position: 'end' })
                                }                           
                            }
                            else if(confirmation.customId === "resume-button")
                            {
                                console.log("resume button clicked. Resuming the song");
                                globals.player.unpause();

                                nowPlayingEmbedFields[1].value = 'Playing';
                                nowPlayingEmbed.setFields(nowPlayingEmbedFields);
  
                                try
                                {
                                    await confirmation.update({ embeds: [nowPlayingEmbed], components: [playingRow], position: 'end' });
                                }
                                catch(err)
                                {
                                    console.error("Error updating message: ");
                                    console.error(err);

                                    await globals.playerMessage.edit({ embeds: [nowPlayingEmbed], components: [playingRow], position: 'end' });
                                }
                            }
                            else if(confirmation.customId === "loop-button")
                            {
                                if(globals.autoplay)
                                {
                                    const embed = new EmbedBuilder()
                                    .setColor(0xff0000)
                                    .setTitle("You can't toggle loop while autoplay is active!")
                                    .setTimestamp()
    
                                    await confirmation.channel.send({ embeds: [embed] });
                                    return;
                                }
                                console.log("Loop button clicked. Changing loop type");
                                if(globals.loop === globals.LoopType.NO_LOOP)
                                {
                                    globals.loop = globals.LoopType.LOOP_SONG;
                                }
                                else if(globals.loop === globals.LoopType.LOOP_SONG)
                                {
                                    globals.loop = globals.LoopType.LOOP_QUEUE;
                                }
                                else if(globals.loop === globals.LoopType.LOOP_QUEUE)
                                {
                                    globals.loop = globals.LoopType.NO_LOOP;
                                }

                                nowPlayingEmbedFields[2].value = globals.loop === globals.LoopType.NO_LOOP ? 'No loop' : globals.loop === globals.LoopType.LOOP_SONG ? 'Song loop' : 'Queue loop';
                                nowPlayingEmbed.setFields(nowPlayingEmbedFields);
                               
                                try
                                {
                                    await confirmation.update({ embeds: [nowPlayingEmbed], position: 'end' });
                                }
                                catch(err)
                                {
                                    console.error("Error updating message: ");
                                    console.error(err);

                                    await globals.playerMessage.edit({  embeds: [nowPlayingEmbed], position: 'end' });
                                }    

                            }
                            else if(confirmation.customId === "shuffle-button")
                            {
                                console.log("Shuffle button clicked. Toggling shuffle");
                                globals.shuffle = !globals.shuffle;

                                if(globals.shuffle)
                                {
                                    globals.originalQueue = globals.queue;
                                    const firstSong = globals.queue.shift();
                                    globals.queue = globals.queue.sort(() => Math.random() - 0.5);
                                    globals.queue.unshift(firstSong);
                                }
                                else
                                {
                                    globals.queue = globals.originalQueue;
                                }

                                nowPlayingEmbedFields[5].value = globals.shuffle ? 'On' : 'Off';
                                nowPlayingEmbed.setFields(nowPlayingEmbedFields);

                                try
                                {
                                    await confirmation.update({ embeds: [nowPlayingEmbed], position: 'end' });
                                }
                                catch(err)
                                {
                                    console.error("Error updating message: ");
                                    console.error(err);

                                    await globals.playerMessage.edit({  embeds: [nowPlayingEmbed], position: 'end' });
                                }    
                            }                            
                        })
                    }
                    catch(err)
                    {
                        console.error("Interaction collector error: " + err);
                    }
                };
            }
        
            globals.player.on('idle', async () => {
                if(globals.schedulerPlaying)
                {
                    console.log("Scheduler playing");
                    globals.schedulerPlaying = false;
                    clearTimeout(globals.timeout);
                    console.log("Timeout for clearing variables and disconnecting stopped");
                    playNextSong(); 
                    return;
                }

                if(globals.autoplay)
                {
                    console.log("Autoplay enabled, searching for next song");

                    try
                    {
                        console.log("Trying to obtain spotify token");
                        if(globals.spotify_token_expires < Date.now() || globals.spotify_token === null)
                        {
                            try
                            { 
                                const reposne = await fetch('https://accounts.spotify.com/api/token', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: new URLSearchParams({
                                        grant_type: 'client_credentials',
                                        client_id: spotify_clientID,
                                        client_secret: spotify_clientSecret
                                    }),
                                });
        
                                const data = await reposne.json();
                                if(data.error)
                                {
                                    console.error("Error obtaining spotify token: " + data.error);
                                    const embed = new EmbedBuilder()
                                    .setColor(0xff0000)
                                    .setTitle("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json")
                                    .setTimestamp()
        
                                    await interaction.send({ embeds: [embed] });
                                    globals.autoplay = false;
                                    return;
                                }
                                globals.spotify_token = data.access_token;
                                globals.spotify_token_expires = Date.now() + (data.expires_in * 1000);
                            }
                            catch(err)
                            {
                                console.error("Error obtaining spotify token: " + err);
                                const embed = new EmbedBuilder()
                                .setColor(0xff0000)
                                .setTitle("Error obtaining spotify token, please define spotify_clientID and spotify_clientSecret in config.json or try again later")
                                .setTimestamp()

                                await interaction.send({ embeds: [embed] });
                                globals.autoplay = false;
                                return;
                            }
                        }

                        if(globals.spotify_token && globals.spotify_token_expires > Date.now())
                        {
                            let trackId;
                            let artistId;
                            try 
                            {
                                const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(globals.queue[0].title)}&type=track&limit=1`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': 'Bearer ' + globals.spotify_token,
                                        'Content-Type': 'application/json'
                                    }
                                });

                                const data = await response.json();
                                const track = data.tracks.items[0];
                                trackId = track.id;
                                artistId = track.artists[0].id;
                            } 
                            catch (err) 
                            {
                                console.error("Error getting track ID: " + err);
                                trackId = null;
                                const embed = new EmbedBuilder()
                                .setColor(0xff0000)
                                .setTitle("Error getting track ID")
                                .setTimestamp()

                                await globals.commandChannel.send({ embeds: [embed] });
                                globals.autoplay = false;
                                return;
                            }

                            if(trackId === null)
                            {
                                console.log("No track ID found");
                                const embed = new EmbedBuilder()
                                .setColor(0xff0000)
                                .setTitle("No track ID found for the song")
                                .setTimestamp()

                                await globals.commandChannel.send({ embeds: [embed] });
                                
                                globals.autoplay = false;
                                return;
                            }

                            try
                            {
                                console.log("Spotify token obtained");
                                const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${encodeURIComponent(trackId)}&seed_artist=${encodeURIComponent(artistId)}&limit=1`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': 'Bearer ' + globals.spotify_token,
                                        'Content-Type': 'application/json'
                                    },

                                });
    
                                const data = await response.json();
                                console.log("Spotify song obtained");
                                const song = data.tracks[0];
                                const searchResults = await ytsr(song.name + " " + song.artists[0].name, { limit: 1 });
                                const video = searchResults.items[0];
                                const time = song.duration_ms / 1000;
                                const formatedTime = time.toString().includes(":") ? time : new Date(time * 1000).toISOString().substr(time < 3600 ? 14 : 11, 5);
                                const newSong = {
                                    title: video.title,
                                    artist: video.author.name,
                                    artist_url: video.author.bestAvatar.url,
                                    url: video.url,
                                    image: video.bestThumbnail.url,
                                    length: formatedTime
                                };
                                globals.queue.push(newSong);
                                console.log("Autoplay song added to queue");
                            }
                            catch(err)
                            {
                                console.error("Error getting song from spotify: " + err);
                                const embed = new EmbedBuilder()
                                .setColor(0xff0000)
                                .setTitle("Error getting song from spotify")
                                .setTimestamp()

                                await globals.commandChannel.send({ embeds: [embed] });
                                globals.autoplay = false;
                                return;
                            }
                        }
                    }
                    catch(err)
                    {
                        console.error("Autoplay error: " + err);
                        const embed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle("Error obtaining spotify token")
                        .setTimestamp()

                        await globals.commandChannel.send({ embeds: [embed] });
                        globals.autoplay = false;
                        return;
                    }
                }

                if(!globals.isSkipped)
                {
                    console.log("Player idle");
                    globals.isSkipped = true;
    
                    if(globals.playEarlier)
                    {
                        console.log("Playing earlier song");
                        globals.playEarlier = false;
                        globals.queue.unshift(globals.playedSongs[0])
                        clearTimeout(globals.timeout);
                        console.log("Timeout for clearing variables and disconnecting stopped");
                        globals.playedSongs.shift();
                    }
                    else
                    {
                        console.log("Loop type: " + globals.loop);
                        switch(globals.loop)
                        {
                            case globals.LoopType.LOOP_QUEUE:
                                globals.queue.push(globals.queue[0]);
                                globals.playedSongs.unshift(globals.queue[0])
                                globals.queue.shift();
                                break;
                            case globals.LoopType.LOOP_SONG:
                                globals.queue.unshift(globals.queue[0]);
                                globals.queue.shift();
                                break;
                            case globals.LoopType.NO_LOOP:
                                globals.playedSongs.unshift(globals.queue[0])
                                globals.queue.shift(); 
                                globals.originalQueue.filter(song => song !== globals.queue[0]);
                                break;
                            default:
                                globals.playedSongs.unshift(globals.queue[0])
                                globals.queue.shift(); 
                                globals.originalQueue.filter(song => song !== globals.queue[0]);
    
                                break;
                        }
                        clearTimeout(globals.timeout);
                        console.log("Timeout for clearing variables and disconnecting stopped");
                    }

                    if (globals.queue.length === 0) 
                    {
                        globals.nowPlayingMessage = null;
                        globals.firstCommandTimestamp = null;

                        console.log("Queue empty, disconnecting, clearing variables and deleting messages");
                        globals.commandChannel.messages
                            .fetch(globals.nowPlayingMessage)
                            .then((message) => {
                                if (message) message.delete();
                            })
                            .catch(console.error);

                        globals.commandChannel.messages
                            .fetch({ limit: 100 })
                            .then(async (messages) => {
                                const botMessages = await messages.filter(
                                    (message) =>
                                        message.author.bot && (message.createdTimestamp > globals.firstCommandTimestamp)
                                );
                                
                                globals.commandChannel
                                .bulkDelete(botMessages, true)
                                .then(() => {
                                    console.log('Bot messages and replies deleted');
                                })
                                .catch((error) => {
                                    console.error('Error deleting bot messages and replies:', error);
                                });
                            })
                            .catch((error) => {
                                console.error('Error fetching messages:', error);
                            });
                        
                        globals.timeout = setTimeout(() => {
                            console.log("End of timeout");
                            if(globals.queue.length === 0 && globals.player.state.status === AudioPlayerStatus.Idle)
                            {
                                console.log("Disconnecting from voice channel after timeout");
                                connection.disconnect();
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
                                globals.nowPlayingMessage = null;
                            }
                        }, 300000)
                    }
                    else if(globals.playEarlier)
                    {
                        console.log("Playing earlier song");
                        clearTimeout(globals.timeout);
                        console.log("Timeout for clearing variables and disconnecting stopped");
                        globals.playEarlier = false;
                        playNextSong();
                    }
                    else
                    {
                        console.log("Playing next song");
                        clearTimeout(globals.timeout);
                        console.log("Timeout for clearing variables and disconnecting stopped");
                        playNextSong(); 
                    }
                    
                }
            });
            
            if(globals.player.state.status === AudioPlayerStatus.Playing)
            {
                console.log("Player is playing");
                return;    
            }
            else 
            {
                console.log("Playing first song"); 
                clearTimeout(globals.timeout);
                console.log("Timeout for clearing variables and disconnecting stopped");
                playNextSong();
            }
        }
    }    
}
