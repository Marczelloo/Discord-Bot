const LoopType = {
    NO_LOOP: 0,
    LOOP_QUEUE: 1,
    LOOP_SONG: 2
};

// module.exports = {
//     queue: [],
//     originalQueue: [],
//     playedSongs: [],
//     firstCommandTimestamp: null,
//     guildId: null,
//     commandChannel: null,
//     playEarlier: false,
//     ageRestricted: false,
//     player: null,
//     resource: null,
//     client: null,
//     eqEffect: null,
//     isSkipped: false,
//     LoopType: LoopType,
//     loop: LoopType.NO_LOOP,
//     shuffle: false, //
//     nowPlayingMessage: null,
//     schedulerPlaying: false,
//     timeout: null,
//     autoplay: false,
//     spotify_token: null,
//     spotify_token_expires: null,
//     playerMessage: null,
// };

//variables set to work on multiple servers at a time
const serverData = new Map();

module.exports = {
    getServerData: function(guildId) {
        if (!serverData.has(guildId)) {
            serverData.set(guildId, {
                queue: [],
                originalQueue: [],
                playedSongs: [],
                firstCommandTimestamp: null,
                commandChannel: null,
                playEarlier: false,
                ageRestricted: false,
                player: null,
                resource: null,
                client: null,
                eqEffect: null,
                isSkipped: false,
                loop: LoopType.NO_LOOP,
                shuffle: false,
                nowPlayingMessage: null,
                schedulerPlaying: false,
                timeout: null,
                autoplay: false,
                spotify_token: null,
                spotify_token_expires: null,
                playerMessage: null,
                coll: null,
            });
        }
        return serverData.get(guildId);
    },
    setGlobalVariable: function(guildId, propertyName, value) {
        const server = this.getServerData(guildId);
        server[propertyName] = value;
    },
    setSongInQueue: function(guildId, position, song, queueType) {
        const server = this.getServerData(guildId);
        if(queueType === "queue")
            server.queue[position] = song;
        else if(queueType === "originalQueue")
            server.originalQueue[position] = song;
        else if(queueType === "playedSongs")
            server.playedSongs[position] = song;
        else 
            console.error("Invalid queueType");
    },
    addToQueue: function(guildId, song, queueType) {
        const server = this.getServerData(guildId);
        if(queueType === "queue")
            server.queue.push(song);
        else if(queueType === "originalQueue")
            server.originalQueue.push(song);
        else if(queueType === "playedSongs")
            server.playedSongs.push(song);
        else 
            console.error("Invalid queueType");
    },
    shiftQueue: function(guildId, queueType) {
        const server = this.getServerData(guildId);
        if(queueType === "queue")
            server.queue.shift();
        else if(queueType === "originalQueue")
            server.originalQueue.shift();
        else if(queueType === "playedSongs")
            server.playedSongs.shift();
        else 
            console.error("Invalid queueType");
    },
    LoopType: LoopType,
};

