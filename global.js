const LoopType = {
    NO_LOOP: 0,
    LOOP_QUEUE: 1,
    LOOP_SONG: 2
};

module.exports = {
    queue: [],
    originalQueue: [],
    playedSongs: [],
    firstCommandTimestamp: null,
    player: null,
    resource: null,
    client: null,
    eqEffect: null,
    isSkipped: false,
    LoopType: LoopType,
    loop: LoopType.NO_LOOP,
    shuffle: false, //
    nowPlayingMessage: null,
    schedulerPlaying: false,
};

