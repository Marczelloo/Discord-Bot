const LoopType = {
    NO_LOOP: 0,
    LOOP_QUEUE: 1,
    LOOP_SONG: 2
};

const serverData = new Map();

let client = null;

function getServerData(guildId) {
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
}

function setGlobalVariable(guildId, propertyName, value) {
    const server = getServerData(guildId);
    server[propertyName] = value;
}

function setSongInQueue(guildId, position, song, queueType) {
    const server = getServerData(guildId);
        if(queueType === "queue")
            server.queue[position] = song;
        else if(queueType === "originalQueue")
            server.originalQueue[position] = song;
        else if(queueType === "playedSongs")
            server.playedSongs[position] = song;
        else 
            console.error("Invalid queueType");
}

function addToQueue(guildId, song, queueType) {
    const server = getServerData(guildId);
        if(queueType === "queue")
            server.queue.push(song);
        else if(queueType === "originalQueue")
            server.originalQueue.push(song);
        else if(queueType === "playedSongs")
            server.playedSongs.push(song);
        else 
            console.error("Invalid queueType");
}

function shiftQueue(guildId, queueType) {
    const server = getServerData(guildId);
    if(queueType === "queue")
        server.queue.shift();
    else if(queueType === "originalQueue")
        server.originalQueue.shift();
    else if(queueType === "playedSongs")
        server.playedSongs.shift();
    else 
        console.error("Invalid queueType");
}

function unshiftQueue(guildId, queueType, song = null) {
    const server = getServerData(guildId);
    if(queueType === "queue")
        song ? server.queue.unshift(song) : server.queue.unshift();
    else if(queueType === "originalQueue")
        song ? server.originalQueue.unshift(song) : server.originalQueue.unshift();
    else if(queueType === "playedSongs")
        song ? server.playedSongs.unshift(song) : server.playedSongs.unshift();
    else 
        console.error("Invalid queueType");
}

function clearGlobalVariables(guildId) {
    const server = getServerData(guildId);
    server.queue = [];
    server.originalQueue = [];
    server.playedSongs = [];
    server.firstCommandTimestamp = null;
    server.commandChannel = null;
    server.playEarlier = false;
    server.ageRestricted = false;
    server.player = null;
    server.resource = null;
    server.client = null;
    server.eqEffect = null;
    server.isSkipped = false;
    server.loop = LoopType.NO_LOOP;
    server.shuffle = false;
    server.nowPlayingMessage = null;
    server.schedulerPlaying = false;
    server.timeout = null;
    server.autoplay = false;
    server.spotify_token = null;
    server.spotify_token_expires = null;
    server.playerMessage = null;
}

function getClient() {
    return client;
}

function setClient(_client) {
    client = _client;
}

module.exports = {
    getServerData: getServerData,
    setGlobalVariable: setGlobalVariable,
    setSongInQueue: setSongInQueue,
    addToQueue: addToQueue,
    shiftQueue: shiftQueue,
    unshiftQueue: unshiftQueue,
    clearGlobalVariables: clearGlobalVariables,
    LoopType: LoopType,
    getClient: getClient,
    setClient: setClient
};

