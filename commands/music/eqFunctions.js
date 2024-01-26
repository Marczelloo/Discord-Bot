const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const globals = require('../../global.js');

async function bassBoost() {
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilter([
                    'equalizer=f=50:width_type=h:width=100:g=8', // Podniesienie basu przy 60 Hz
                    'equalizer=f=100:width_type=h:width=100:g=10', // Podniesienie średnich tonów przy 400 Hz
                    'equalizer=f=200:width_type=h:width=100:g=5', // Podniesienie wyższych średnich tonów przy 2500 Hz
                    ])
                    .on('error', (err) => {
                        console.error(err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log("Bass boost finished");
                        resolve();
                    })
                    .save(output);
            }
        });
    });
}

async function bassBoostV2() {
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
                reject(err);
            } else {
                ffmpeg(input)
                .audioFilter('equalizer=f=40:width_type=h:width=50:g=10')
                    .on('error', (err) => {
                        console.error(err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log("Bass boost v2 finished");
                        resolve();
                    })
                    .save(output);
            }
        });
    });
}

async function earrape()
{
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
                reject(err);
            } else {
                ffmpeg(input)
                    .audioFilter('volume=100')
                    .on('error', (err) => {
                        console.error(err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log("Earrape finished");
                        resolve();
                    })
                    .save(output);
            }
        });
    
    })
}

async function nightcore()
{
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
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
                        console.error(err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log("Nightcore finished");
                        resolve();
                    })
                    .save(output);
            }
        });
    })
}

async function slowReverb() {
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
                reject(err);
            } else {
                ffmpeg(input)
                    .audioFilter([
                        'atempo=0.8',
                        'aecho=0.8:0.6:250:0.3',
                        'lowpass=f=850'
                    ])
                    .on('error', (err) => {
                        console.error(err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log("Slow and reverbed finished");
                        resolve();
                    })
                    .save(output);
            }
        });
    })
}

async function eightBit() {
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
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
                        console.error(err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log("8 bit finished");
                        resolve();
                    })
                    .save(output);
            }
        });
    });
}


async function dolbyRetardos() {
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
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
                    console.error(err);
                    reject(err);
                })
                .on('end', () => {
                    console.log("dolbyRetardos finished");
                    resolve();
                })
                .save(output);
            }
        });
    });
}

async function inverted()
{             
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Cannot open song file: ${err}`);
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
                    console.error(err);
                    reject(err);
                })
                .on('end', () => {
                    console.log("Inverted finished");
                    resolve();
                })
                .save(output);
            }
        });
    });

}

async function toiletAtClub()
{
    const input = path.join(__dirname, "output.ogg");
    const output = path.join(__dirname, "eqOutput.ogg");

    return new Promise((resolve, reject) => {
        fs.access(input, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if(err) 
            {
                console.error(`Cannot open song file: ${err}`);
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
                    console.error(err);
                    reject(err);
                })
                .on('end', () => {
                    console.log("Bathroom at club finished");
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