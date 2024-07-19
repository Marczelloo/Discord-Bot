const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const Log = require('./fancyLogs/log');

async function bassBoost(interaction) {
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying bass boost", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.err("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilter([
                    'equalizer=f=50:width_type=h:width=100:g=8',
                    'equalizer=f=100:width_type=h:width=100:g=10',
                    'equalizer=f=200:width_type=h:width=100:g=5',
                    ])
                    .on('error', (err) => {
                        Log.error("Error applying bass boost", err, interaction.guild.id, interaction.guild.name);
                        reject(err);
                    })
                    .on('end', () => {
                        Log.success("Bass boost finished", null, interaction.guild.id, interaction.guild.name);
                        resolve();
                    })
                    .save(output);
            }
        });
    });
}

async function bassBoostV2(interaction) {
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying bass boost v2", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.error("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilter('equalizer=f=40:width_type=h:width=50:g=10')
                    .on('error', (err) => {
                        Log.error("Error applying bass boost v2", err, interaction.guild.id, interaction.guild.name);
                        reject(err);
                    })
                    .on('end', () => {
                        Log.success("Bass boost v2 finished", null, interaction.guild.id, interaction.guild.name);
                        resolve();
                    })
                    .save(output);
            }
        });
    });
}

async function earrape(interaction){
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying earrape", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.err("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                    .audioFilter('volume=100')
                    .on('error', (err) => {
                        Log.error("Error applying earrape", err, interaction.guild.id, interaction.guild.name);
                        reject(err);
                    })
                    .on('end', () => {
                        Log.success("Earrape finished", null, interaction.guild.id, interaction.guild.name);
                        resolve();
                    })
                    .save(output);
            }
        });
    
    })
}

async function nightcore(interaction)
{
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying nightcore", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.error("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                    .audioFilter([
                        'asetrate=44100*1.25', // Increase the audio playback speed
                        'atempo=1.5', // Increase the audio tempo
                        'aresample=44100', // Set the audio sample rate
                        'atempo=0.8', // Decrease the audio tempo
                        'aresample=48000' // Set the audio sample rate
                    ])   
                    .on('error', (err) => {
                        Log.error("Error applying nightcore", err, interaction.guild.id, interaction.guild.name);
                        reject(err);
                    })
                    .on('end', () => {
                        Log.success("Nightcore finished", null, interaction.guild.id, interaction.guild.name);
                        resolve();
                    })
                    .save(output);
            }
        });
    })
}

async function slowReverb(interaction) {
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying slow and reverbed", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.error("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                    .audioFilter([
                        'atempo=0.8',
                        'aecho=0.8:0.6:250:0.3',
                        'lowpass=f=850'
                    ])
                    .on('error', (err) => {
                        Log.error("Error applying slow and reverbed", err, interaction.guild.id, interaction.guild.name);
                        reject(err);
                    })
                    .on('end', () => {
                        Log.success("Slow and reverbed finished", null, interaction.guild.id, interaction.guild.name);
                        resolve();
                    })
                    .save(output);
            }
        });
    })
}

async function eightBit(interaction) {
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying 8 bit", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.error("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilter([
                    'aformat=sample_fmts=u8:channel_layouts=mono',
                    'aresample=8000',
                    'atempo=1.0',
                    'bandpass=f=1000:width_type=h:width=1000',
                    'volume=60'
                ])                     
                .audioBitrate('8k')
                    .on('error', (err) => {
                        Log.error("Error applying 8 bit", err, interaction.guild.id, interaction.guild.name);
                        reject(err);
                    })
                    .on('end', () => {
                        Log.success("8 bit finished", null, interaction.guild.id, interaction.guild.name);
                        resolve();
                    })
                    .save(output);
            }
        });
    });
}


async function dolbyRetardos(interaction) {
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying dolby retardos", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.error("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilters([
                    { filter: 'aphaser', options: {type: 't', decay: 0.4} },  // Add phase to create a spatial effect
                    { filter: 'aecho', options: {in_gain: 0.8, out_gain: 0.88, delays: 60, decays: 0.4} },    // Light echo for adding depth
                    { filter: 'pan', options: 'stereo|c0=c0+c1|c1=c0+c1' }, // Mixing channels for stereo effect
                    { filter: 'equalizer', options: {frequency: 1000, width_type: 'h', width: 200, gain: 5} }  // Gentle EQ correction for improving clarity
                ])
                .outputOptions([
                    '-ac', '2' // Ustawienie wyjścia na stereo
                ])
                .on('error', (err) => {
                    Log.error("Error applying dolby retardos", err, interaction.guild.id, interaction.guild.name);
                    reject(err);
                })
                .on('end', () => {
                    Log.success("Dolby Retardos finished", null, interaction.guild.id, interaction.guild.name); 
                    resolve();
                })
                .save(output);
            }
        });
    });
}

async function inverted(interaction){             
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying inverted", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                Log.err("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilters([
                    { filter: 'areverse' } // Odwrócenie audio
                ])
                .outputOptions([
                    '-ac', '1' // Ustawienie wyjścia na mono
                ])     
                .on('error', (err) => {
                    Log.error("Error applying inverted", err, interaction.guild.id, interaction.guild.name);
                    reject(err);
                })
                .on('end', () => {
                    Log.success("Inverted finished", null, interaction.guild.id, interaction.guild.name);
                    resolve();
                })
                .save(output);
            }
        });
    });

}

async function toiletAtClub(interaction){
    const input = path.resolve(__dirname, __dirname + "/../temp/" + "output_" + interaction.guild.id + ".ogg");
    const output = path.resolve(__dirname, __dirname + "/../temp/" + "outputEQ_" + interaction.guild.id + ".ogg");

    Log.info("Applying bathroom at club", null, interaction.guild.id, interaction.guild.name);

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if(err) 
            {   
                Log.error("Cannot open song file", err, interaction.guild.id, interaction.guild.name);
                reject(err);
            }
            else
            {
                ffmpeg(input)
                .audioFilters([
                    { filter: 'aphaser', options: { type: 't', decay: 0.4 } }, // Add phase to create a spatial effect
                    { filter: 'aecho', options: { in_gain: 0.8, out_gain: 0.88, delays: 60, decays: 0.4 } }, // Light echo for adding depth
                    { filter: 'pan', options: 'stereo|c0=c0+c1|c1=c0+c1' }, // Mixing channels for stereo effect
                    { filter: 'equalizer', options: { frequency: 1000, width_type: 'h', width: 200, gain: 5 } }, // Gentle EQ correction for improving clarity
                    { filter: 'reverb', options: { type: 'room', mix: 0.5 } }, // Add reverb for a spacious effect
                    { filter: 'chorus', options: { in_gain: 0.5, out_gain: 0.8, delays: '20|40', decays: '0.4|0.3', speeds: '0.3|0.2' } } // Chorus effect for a swirling sound
                ])
                .outputOptions([
                    '-ac', '2' // Set output to stereo
                ])
                .on('error', (err) => {
                    Log.error("Error applying bathroom at club", err, interaction.guild.id, interaction.guild.name);
                    reject(err);
                })
                .on('end', () => {
                    Log.success("Bathroom at club finished", null, interaction.guild.id, interaction.guild.name);
                    resolve();
                })
                .save(output);
            }
        });
    })
}

module.exports = {
    bassBoost: bassBoost,
    bassBoostV2: bassBoostV2,
    earrape: earrape,
    nightcore: nightcore,
    slowReverb: slowReverb,
    eightBit: eightBit,
    dolbyRetardos: dolbyRetardos,
    inverted: inverted,
    toiletAtClub: toiletAtClub
}